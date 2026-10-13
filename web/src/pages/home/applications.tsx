import { EmptyCardType } from '@/components/empty/constant';
import { EmptyAppCard } from '@/components/empty/empty';
import { HomeIcon } from '@/components/svg-icon';
import { Segmented, SegmentedValue } from '@/components/ui/segmented';
import { Routes } from '@/routes';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { SeeAllAppCard } from './application-card';
import { ChatList } from './chat-list';
import { SearchList } from './search-list';

const IconMap = {
  [Routes.Chats]: 'chats',
  [Routes.Searches]: 'searches',
};

const EmptyTypeMap = {
  [Routes.Chats]: EmptyCardType.Chat,
  [Routes.Searches]: EmptyCardType.Search,
};

export function Applications() {
  const [val, setVal] = useState(Routes.Chats);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [listLength, setListLength] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNavigate = useCallback(
    ({ isCreate }: { isCreate?: boolean }) => {
      if (isCreate) {
        navigate(val + '?isCreate=true');
      } else {
        navigate(val);
      }
    },
    [navigate, val],
  );

  const options = useMemo(
    () => [
      { value: Routes.Chats, label: t('header.chat') },
      { value: Routes.Searches, label: t('header.search') },
    ],
    [t],
  );

  const handleChange = (path: SegmentedValue) => {
    setVal(path as Routes);
    setListLength(0);
    setLoading(true);
  };

  return (
    <section className="mt-8 border-t border-border-button pt-6">
      <header className="flex justify-between items-center mb-2.5">
        <h2 className="text-xl font-semibold">
          <HomeIcon
            imgClass="me-2.5"
            name={`${IconMap[val as keyof typeof IconMap]}`}
            width={24}
          />
          {options.find((x) => x.value === val)?.label}
        </h2>

        <Segmented
          buttonSize="sm"
          options={options}
          value={val}
          onChange={handleChange}
          // className="bg-bg-card border border-border-button rounded-lg"
          // activeClassName="bg-text-primary border-none rounded-lg"
        />
      </header>

      {/* <div className="flex flex-wrap gap-4"> */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {val === Routes.Chats && (
          <ChatList setListLength={setListLength} setLoading={setLoading} />
        )}
        {val === Routes.Searches && (
          <SearchList setListLength={setListLength} setLoading={setLoading} />
        )}
        {listLength > 0 && (
          <SeeAllAppCard click={() => handleNavigate({ isCreate: false })} />
        )}
      </div>

      {listLength <= 0 && !loading && (
        <div className="w-[210px]">
          <EmptyAppCard
            type={EmptyTypeMap[val as keyof typeof EmptyTypeMap]}
            onClick={() => handleNavigate({ isCreate: true })}
          />
        </div>
      )}
      {/* </div> */}
    </section>
  );
}
