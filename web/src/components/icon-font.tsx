/*
 *  Copyright 2026 The InfiniFlow Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { FileIconMap } from '@/constants/file';
import { cn } from '@/lib/utils';
import { getExtension } from '@/utils/document-util';
import {
  File as LucideFile,
  Database,
  Search,
  Folder,
  Play,
  RefreshCw,
  Network,
  Workflow,
  Plug,
  HousePlus,
  ListFilter,
  MessageSquare,
  Repeat,
  GitBranch,
  Code,
  Bot,
  Hourglass,
  TextCursorInput,
  NotebookPen,
  DatabaseZap,
  Globe,
  Mail,
  List,
  Variable,
  Combine,
} from 'lucide-react';
import { CSSProperties } from 'react';
import SvgIcon, { hasSvgIcon } from './svg-icon';

type IconFontType = {
  name: string;
  className?: string;
  style?: CSSProperties;
};

const InterfaceIcons = {
  data: Database,
  search: Search,
  'file-sub': Folder,
  play: Play,
  reparse: RefreshCw,
  knowledgegraph: Network,
  'dataflow-01': Workflow,
  mcp: Plug,
  KR: Search,
  'house-plus': HousePlus,
  'a-QuestionClassification': ListFilter,
  reply: MessageSquare,
  loop: Repeat,
  condition: GitBranch,
  'code-set': Code,
  'agent-ai': Bot,
  await: Hourglass,
  'a-textprocessing': TextCursorInput,
  'notebook-pen': NotebookPen,
  'executesql-0': DatabaseZap,
  'httprequest-0': Globe,
  'sendemail-0': Mail,
  'a-listoperations': List,
  'a-ariableassigner': Variable,
  aggregator: Combine,
};

export const IconFont = ({ name, className, style }: IconFontType) => {
  const Icon = InterfaceIcons[name as keyof typeof InterfaceIcons];
  if (Icon)
    return (
      <Icon
        className={cn('size-4', className)}
        style={style}
        aria-hidden="true"
      />
    );
  return (
    <svg className={cn('size-4', className)} style={style}>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
};

export function IconFontFill({
  name,
  className,
  isFill = true,
}: IconFontType & { isFill?: boolean }) {
  const Icon = InterfaceIcons[name as keyof typeof InterfaceIcons];
  if (Icon)
    return <Icon className={cn('size-4', className)} aria-hidden="true" />;
  return (
    <svg
      className={cn('size-4', className)}
      style={{ fill: isFill ? 'currentColor' : '' }}
    >
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
}

export function FileIcon({
  name,
  className,
  type,
}: IconFontType & { type?: string }) {
  const isFolder = type === 'folder';
  const isSkills = type === 'skills';
  const extension = getExtension(name);
  const spriteIcon = FileIconMap[extension as keyof typeof FileIconMap];
  const assetIcon = `file-icon/${extension}`;
  if (isSkills) {
    return (
      <span className={cn('size-4', className)}>
        <SvgIcon name="home-icon/skills" width={16} height={16} />
      </span>
    );
  }
  return (
    <span className={cn('size-4', className)}>
      {isFolder ? (
        <IconFont name="file-sub"></IconFont>
      ) : spriteIcon ? (
        <IconFont name={spriteIcon}></IconFont>
      ) : hasSvgIcon(assetIcon) ? (
        <SvgIcon name={assetIcon} width={16}></SvgIcon>
      ) : (
        <LucideFile className="size-4"></LucideFile>
      )}
    </span>
  );
}
