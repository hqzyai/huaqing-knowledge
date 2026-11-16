# Huaqing-knowledge 本机开发与服务器更新

## 开发与提交

本机代码目录：`/Users/xiaozp/working/ragflow`。服务器目录：
`ubuntu@192.168.2.11:/home/ubuntu/Workspace/ragflow`。

在当前功能分支开发，开始前执行 `git status --short --branch`；不要自动切换到手册指定的旧分支。
按功能明确暂存文件、运行相关检查后提交，不使用未经检查的 `git add .`。
不得提交模型密钥、运行日志、数据库数据或服务器专用 `docker/.env`。

## Mac 完整部署

以下命令均在仓库根目录执行。Docker Desktop 需要提供 Compose 中要求的 CPU 和内存。
使用本机已有的 `local/huaqing-knowledge:server-baseline-20261113` 镜像；不从头构建。
该镜像为 AMD64，在 Apple Silicon 上通过模拟运行。

首次准备模型卷（已有卷不会覆盖）：

```bash
docker image inspect local/huaqing-knowledge:server-baseline-20261113 >/dev/null
docker volume create ragflow-mac-dev-model-resources-v011
docker run --rm --platform linux/amd64 --entrypoint /bin/true \
  -v ragflow-mac-dev-model-resources-v011:/ragflow/rag/res \
  local/huaqing-knowledge:server-baseline-20261113
```

前端首次构建后启动：

```bash
(cd web && VITE_MINIFY=esbuild VITE_BUILD_SOURCEMAP=false npm run build)
docker compose -f docker/compose.mac-dev.yml -f docker/compose.mac-dev-source.yml up -d
```

- Docker 页面：`http://localhost:28000`，使用 `web/dist`。
- API：`http://localhost:9380`。
- 热更新开发页面：以下命令明确指定 Python 后端和 5173，避免仓库默认的 9222 端口冲突。

```bash
cd web
API_PROXY_SCHEME=python npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

源码挂载包括 `api`、`rag`、`common`、`deepdoc`；模型资源由独立卷保留。
Python 修改需重启应用，前端修改在开发页面热更新，28000 页面需重新构建。

```bash
docker compose -f docker/compose.mac-dev.yml -f docker/compose.mac-dev-source.yml restart app
```

重启前检查运行中的生成任务。重建容器会更换 worker 身份，不保证自动接管旧 worker 的待确认任务；
应等待任务结束，或通过应用重新发起生成，并检查进度。不要重复提交多个相同任务。
本机 Compose 使用独立项目名和数据卷，开发凭据仅适用于本机；没有额外模型速率限制。

## 同步到局域网服务器

服务器 Compose 项目为 `ragflow-workspace`，应用服务为 `ragflow-cpu`。
同步前先构建前端，再预演；核对后去掉 `--dry-run` 正式同步：

```bash
rsync -az --dry-run --delete \
  --exclude='.git/' --exclude='.venv/' --exclude='web/node_modules/' \
  --exclude='docker/.env' --exclude='docker/data/' --exclude='docker/ragflow-logs/' \
  --exclude='logs/' --exclude='rag/res/' --exclude='ragflow-test-data/' \
  --exclude='RAGFlow访问与维护说明.md' \
  /Users/xiaozp/working/ragflow/ \
  ubuntu@192.168.2.11:/home/ubuntu/Workspace/ragflow/
```

不要添加 `--delete-excluded`。同步前确认服务器运行数据均在排除目录或 Docker 数据卷中。

## 基于现有镜像增量构建

以下在服务器执行。先检查应用容器名称和 Compose 服务是否与当前部署一致。
只覆盖此次 Python 源码和已构建前端，保留基础镜像中的依赖和模型。
新增依赖、Go 二进制或系统组件的修改不适用此流程，应另行准备匹配的基础镜像。

```bash
cd /home/ubuntu/Workspace/ragflow
revision=REPLACE_WITH_LOCAL_GIT_COMMIT
running_image=$(docker inspect ragflow-workspace-ragflow-cpu-1 --format '{{.Image}}')
docker tag "$running_image" local/huaqing-knowledge:overlay-base
docker tag "$running_image" "local/huaqing-knowledge:rollback-$revision"
context_dir=$(mktemp -d)
for directory in api common rag deepdoc; do
  mkdir -p "$context_dir/$directory"
  rsync -a --exclude='__pycache__/' --exclude='*.pyc' --exclude='res/' \
    "$directory/" "$context_dir/$directory/"
done
mkdir -p "$context_dir/web/dist"
rsync -a web/dist/ "$context_dir/web/dist/"
cat > "$context_dir/Dockerfile" <<'DOCKERFILE'
FROM local/huaqing-knowledge:overlay-base
COPY api /ragflow/api
COPY common /ragflow/common
COPY rag /ragflow/rag
COPY deepdoc /ragflow/deepdoc
COPY web/dist /ragflow/web/dist
DOCKERFILE
docker build --pull=false -t "local/huaqing-knowledge:$revision" "$context_dir"
```

把 `revision` 换成本地提交号。必须先给现有镜像打标签，不能把裸 `sha256:...` 当作 `FROM` 镜像名。
临时构建目录避免根目录 `.dockerignore` 排除 `web/dist`，也不包含 `.env` 或 Git 元数据。
构建失败时保留原容器，不执行更新。

## 生效、验证和回滚

构建成功后，将服务器 `docker/.env` 的 `RAGFLOW_IMAGE` 设置为本次完整镜像标签，
其他地址、端口、密码保持不变。然后仅更新应用：

```bash
cd /home/ubuntu/Workspace/ragflow/docker
docker compose -p ragflow-workspace up -d --no-deps --force-recreate ragflow-cpu
docker compose -p ragflow-workspace ps
docker compose -p ragflow-workspace logs --tail=100 ragflow-cpu
curl -fI http://192.168.2.11:28000
```

强制刷新浏览器，验证本次功能，并记录提交号、镜像标签和检查结果。
回滚时把 `RAGFLOW_IMAGE` 改为对应的 `local/huaqing-knowledge:rollback-<提交号>`，再执行同一应用更新命令。
镜像回滚不会撤销数据库或索引变更；涉及数据迁移时需要单独的备份方案。
禁止执行 `docker compose down -v`，不要删除知识库数据卷。
