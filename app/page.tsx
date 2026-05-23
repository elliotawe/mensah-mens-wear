import { getMerchant } from '@/lib/api/merchant';
import { getItems } from '@/lib/api/items';
import { getCampaigns } from '@/lib/api/campaigns';
import { HeroSection } from '@/components/home/HeroSection';
import { CampaignBanner } from '@/components/home/CampaignBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandStory } from '@/components/home/BrandStory';
import { CampaignGrid } from '@/components/home/CampaignGrid';
import { WhatsAppCTA } from '@/components/home/WhatsAppCTA';

export default async function HomePage() {
  const [merchant, items, campaigns] = await Promise.all([
    getMerchant(),
    getItems(),
    getCampaigns(),
  ]);

  const featured = items.filter(i => i.in_stock).slice(0, 8);

  return (
    <>
      <HeroSection merchant={merchant} featuredItems={featured} />
      {campaigns[0] && <CampaignBanner campaign={campaigns[0]} />}
      <FeaturedProducts items={featured} />
      <BrandStory />
      {campaigns.length > 0 && <CampaignGrid campaigns={campaigns} />}
      <WhatsAppCTA whatsappNumber={merchant.whatsapp_number ?? '+233551694847'} />
    </>
  );
}
