export function useTranslation() {
  const t = (key: string): string => {
    const translations: { [key: string]: string } = {
      'nav.brand': 'ShopSense',
      'nav.brandSubtitle': 'Gestão Inteligente',
      'nav.dashboard': 'Dashboard',
      'nav.products': 'Produtos',
      'nav.categories': 'Categorias',
      'nav.lowStock': 'Estoque Baixo',
      'nav.copyright': 'Hypesoft Teste Técnico'
    };
    return translations[key] || key;
  };
  
  return { t };
}