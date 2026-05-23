import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCampaign } from '@/lib/api/campaigns';
import { CampaignDetail } from '@/components/campaigns/CampaignDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const campaign = await getCampaign(id);
    return {
      title: campaign.title,
      description: campaign.copy_text ?? `${campaign.title} — a Mensah luxury menswear campaign.`,
      openGraph: {
        images: campaign.image_urls?.[0]
          ? [{ url: campaign.image_urls[0], alt: campaign.title }]
          : undefined,
      },
    };
  } catch {
    return { title: 'Campaign Not Found' };
  }
}

export default async function CampaignPage({ params }: Props) {
  const { id } = await params;

  let campaign;
  try {
    campaign = await getCampaign(id);
  } catch {
    notFound();
  }

  return <CampaignDetail campaign={campaign} />;
}
