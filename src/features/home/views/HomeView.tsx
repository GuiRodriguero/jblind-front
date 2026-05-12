import { useTranslation } from 'react-i18next';

export function HomeView() {
  const { t } = useTranslation();

  return (
    <div className="h-full flex items-center justify-center text-gray-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{t('home.welcome')}</h1>
        <p>{t('home.welcomeCaption')}</p>
      </div>
    </div>
  );
}
