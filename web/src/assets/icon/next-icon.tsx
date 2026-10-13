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

import { cn } from '@/lib/utils';
import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { ChevronDown, Plug, Users, UserRound, LockKeyhole, LogOut, Blocks, ScrollText, Tags } from 'lucide-react';

type IconComponentProps = CustomIconComponentProps;
const currentColor = 'currentColor';
const ApiSvg = () => <Plug size={24} strokeWidth={1.75} aria-hidden="true" />;
const TeamSvg = () => <Users size={24} strokeWidth={1.75} aria-hidden="true" />;
const ProfileSvg = () => <UserRound size={24} strokeWidth={1.75} aria-hidden="true" />;
const PasswordSvg = () => <LockKeyhole size={24} strokeWidth={1.75} aria-hidden="true" />;
const LogOutSvg = () => <LogOut size={24} strokeWidth={1.75} aria-hidden="true" />;
const ModelProviderSvg = () => <Blocks size={24} strokeWidth={1.75} aria-hidden="true" />;
const PromptSvg = () => <ScrollText size={24} strokeWidth={1.75} aria-hidden="true" />;
const WikipediaSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
  >
    <path
      d="M515.84 559.744c-39.936 82.432-94.592 194.048-121.728 244.394667-26.282667 45.824-48.085333 39.722667-65.365333 1.237333-59.989333-141.696-183.168-390.144-241.109334-529.450667-10.709333-25.642667-18.816-42.112-26.410666-48.597333-7.722667-6.4-23.637333-10.24-47.872-11.562667C4.394667 214.741333 0 212.565333 0 208.981333v-19.413333l2.218667-1.92c39.424-0.213333 230.442667 0 230.442666 0l2.176 1.92v18.517333c0 5.077333-3.2 7.509333-9.6 7.509334l-24.064 1.322666c-20.693333 1.237333-31.018667 6.997333-31.018666 18.602667 0 5.76 2.261333 14.08 7.082666 25.642667 46.165333 112.896 205.568 448.896 205.568 448.896l5.802667 1.962666 102.869333-205.226666-20.565333-45.525334-70.741333-139.264s-13.568-27.904-18.261334-37.205333c-31.061333-61.568-30.378667-64.768-61.738666-68.992-8.832-0.981333-13.354667-2.133333-13.354667-6.357333v-19.968l2.56-1.92h183.125333l4.821334 1.578666v19.242667c0 4.48-3.242667 6.4-9.685334 6.4l-13.141333 2.005333c-33.792 2.602667-28.202667 16.256-5.802667 60.672l67.498667 138.752 75.008-149.504c12.501333-27.306667 9.941333-34.176 4.736-40.405333-2.986667-3.584-13.013333-9.386667-34.645333-10.24l-8.576-0.896a9.728 9.728 0 0 1-6.186667-2.176 6.4 6.4 0 0 1-2.858667-5.504v-18.218667l2.602667-1.92c53.205333-0.341333 172.501333 0 172.501333 0l2.517334 1.92v18.602667c0 5.162667-2.517333 7.594667-8.234667 7.594667-27.562667 1.28-33.365333 4.053333-43.648 18.730666-5.12 7.936-16 25.130667-27.562667 44.330667l-98.176 182.314667-2.773333 5.76 119.125333 243.712 7.253334 2.048 187.562666-445.354667c6.570667-18.005333 5.504-30.805333-2.730666-38.186667-8.405333-7.338667-14.762667-11.648-36.565334-12.586666l-17.92-0.682667a10.88 10.88 0 0 1-6.485333-1.92c-1.834667-1.237333-3.072-3.2-3.072-5.077333v-18.602667l2.517333-1.92h211.669334l1.749333 1.92v18.645333c0 5.077333-3.157333 7.68-8.917333 7.68-27.648 1.28-48.085333 7.68-61.568 17.962667-13.397333 10.88-23.765333 26.282667-31.402667 45.525333 0 0-172.501333 395.008-231.509333 526.464-22.4 42.965333-44.928 39.125333-64.128-1.322666-24.362667-49.962667-75.648-161.536-112.896-243.626667l2.261333-1.536z"
      fill={currentColor}
    ></path>
  </svg>
);
const KeywordSvg = () => <Tags size={24} strokeWidth={1.75} aria-hidden="true" />;
const GitHubSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
  >
    <path
      fill={currentColor}
      d="M938.666667 512a426.666667 426.666667 0 0 1-291.84 404.48 22.186667 22.186667 0 0 1-19.2-2.986667 21.76 21.76 0 0 1-8.96-17.493333v-113.92a170.666667 170.666667 0 0 0-21.333334-87.893333 10.666667 10.666667 0 0 1 0-11.52 11.52 11.52 0 0 1 8.533334-5.973334c104.106667-10.666667 162.133333-52.053333 162.133333-164.693333a200.96 200.96 0 0 0-50.773333-143.36 183.466667 183.466667 0 0 0 8.106666-51.2 184.746667 184.746667 0 0 0-6.4-46.08 20.906667 20.906667 0 0 0-22.613333-15.36 189.866667 189.866667 0 0 0-104.106667 50.346667 422.826667 422.826667 0 0 0-160.426666 0A189.866667 189.866667 0 0 0 327.68 256a20.906667 20.906667 0 0 0-22.613333 15.36A184.746667 184.746667 0 0 0 298.666667 317.44a183.466667 183.466667 0 0 0 8.106666 51.2A200.96 200.96 0 0 0 256 512c0 118.613333 64.426667 158.293333 182.613333 168.106667a158.293333 158.293333 0 0 0-29.44 65.28v5.12a29.013333 29.013333 0 0 0 0 5.973333 25.173333 25.173333 0 0 1-27.306666 21.76 42.666667 42.666667 0 0 1-18.346667-5.12 227.84 227.84 0 0 1-60.586667-53.76 430.506667 430.506667 0 0 0-34.133333-34.56 116.906667 116.906667 0 0 0-25.173333-16.64 20.906667 20.906667 0 0 0-20.48 0 21.333333 21.333333 0 0 0-9.813334 17.92v2.56a21.333333 21.333333 0 0 0 9.813334 17.92 193.706667 193.706667 0 0 1 39.253333 44.8 282.026667 282.026667 0 0 0 67.84 73.386667 105.813333 105.813333 0 0 0 59.733333 17.92h15.36V896a21.76 21.76 0 0 1-8.96 17.493333 22.186667 22.186667 0 0 1-19.2 2.986667A426.666667 426.666667 0 1 1 938.666667 512z"
    ></path>
  </svg>
);
const QWeatherSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
  >
    <path
      fill={currentColor}
      d="M953.6 736c-57.6 51.2-89.6 89.6-166.4 102.4 166.4-160 185.6-422.4 44.8-608-64-89.6-166.4-147.2-275.2-172.8-108.8-19.2-224 0-326.4 57.6-96 57.6-172.8 147.2-204.8 256-32 108.8-32 224 19.2 326.4 44.8 102.4 128 185.6 230.4 236.8 102.4 44.8 217.6 57.6 326.4 25.6 96 6.4 192-12.8 275.2-57.6 70.4-38.4 102.4-96 147.2-160l-70.4-6.4z m-537.6 172.8c-83.2-12.8-166.4-51.2-224-108.8-121.6-128-140.8-326.4-32-467.2 51.2-70.4 128-121.6 211.2-140.8 76.8-19.2 166.4-12.8 243.2 25.6 76.8 38.4 140.8 102.4 172.8 185.6 32 76.8 38.4 166.4 12.8 249.6-25.6 83.2-83.2 153.6-153.6 198.4-25.6 0-44.8-6.4-70.4-6.4-83.2-19.2-153.6-70.4-204.8-134.4-25.6-32-44.8-76.8-44.8-121.6 0-38.4 12.8-70.4 32-96 32-38.4 76.8-57.6 121.6-57.6 12.8 0 25.6 0 38.4 6.4 6.4 0 12.8 0 12.8 6.4 25.6 0 44.8 19.2 57.6 38.4 25.6 44.8 12.8 96-25.6 128-32 12.8-64 19.2-89.6 6.4h-12.8c0 6.4-6.4 6.4 0 12.8 19.2 32 51.2 51.2 89.6 51.2 25.6 0 51.2-6.4 76.8-19.2 57.6-32 96-89.6 96-153.6 0-38.4-12.8-70.4-32-102.4 0 0 0-6.4-6.4-6.4 0 0 0-6.4-6.4-6.4-51.2-64-128-102.4-217.6-102.4-83.2 0-153.6 32-211.2 89.6-83.2 83.2-102.4 211.2-44.8 320 51.2 89.6 128 160 217.6 204.8h-6.4z"
    ></path>
  </svg>
);

const SemicolonSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
  >
    <path
      d="M506.88 249.059556a89.884444 89.884444 0 0 0 60.074667-21.845334 87.950222 87.950222 0 0 0 23.210666-61.44 79.189333 79.189333 0 0 0-83.285333-83.285333c-24.576 0-45.056 6.826667-60.074667 23.210667-16.384 15.018667-23.210667 35.498667-23.210666 60.074666 0 24.576 6.826667 45.056 23.210666 61.44 15.018667 13.653333 35.498667 21.845333 60.074667 21.845334zM414.037333 967.224889a262.030222 262.030222 0 0 0 141.994667-88.746667c35.498667-46.421333 53.248-99.669333 53.248-159.744 0-39.594667-9.557333-70.997333-27.306667-95.573333a89.543111 89.543111 0 0 0-75.093333-38.229333c-27.306667 0-47.786667 6.826667-62.805333 23.210666-17.749333 15.018667-25.941333 35.498667-25.941334 61.44 0 23.210667 8.192 43.690667 24.576 60.074667a79.416889 79.416889 0 0 0 58.709334 24.576 78.506667 78.506667 0 0 0 30.037333-5.461333c0 32.768-9.557333 62.805333-30.037333 91.477333a190.008889 190.008889 0 0 1-87.381334 60.074667v66.901333z"
      fill={currentColor}
    ></path>
  </svg>
);

const CommaSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
  >
    <path
      fill={currentColor}
      d="M701.312 416.064C701.312 327.68 629.76 256 541.312 256c-88.32 0-160 71.68-160 160.064s71.68 160.064 160 160.064c10.368 0 20.352-1.216 30.144-3.072-27.136 78.592-88.32 99.392-166.4 120.32L434.688 736c228.288-40.576 269.184-268.48 266.688-266.496C707.328 452.672 701.312 434.88 701.312 416.064z"
    ></path>
  </svg>
);

export const ApiIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={ApiSvg} {...props} />
);
export const TeamIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={TeamSvg} {...props} />
);
export const ProfileIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={ProfileSvg} {...props} />
);
export const PasswordIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={PasswordSvg} {...props} />
);
export const LogOutIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={LogOutSvg} {...props} />
);
export const ModelProviderIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={ModelProviderSvg} {...props} />
);
export const PromptIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={PromptSvg} {...props} />
);
export const WikipediaIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={WikipediaSvg} {...props} />
);
export const KeywordIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={KeywordSvg} {...props} />
);
export const GitHubIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={GitHubSvg} {...props} />
);
export const QWeatherIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={QWeatherSvg} {...props} />
);

export const SemicolonIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={SemicolonSvg} {...props} />
);

export const CommaIcon = (props: Partial<IconComponentProps>) => (
  <Icon component={CommaSvg} {...props} />
);

export function SideDown({ className }: { className?: string }) {
  return (
    <ChevronDown
      className={cn(
        'transition-transform group-data-[state=open]/collapsible:rotate-180',
        className,
      )}
    />
  );
}
