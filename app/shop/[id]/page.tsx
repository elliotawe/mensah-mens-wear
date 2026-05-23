import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getItem } from '@/lib/api/items';
import { getMerchant } from '@/lib/api/merchant';
import { ProductDetail } from '@/components/shop/ProductDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const item = await getItem(id);
    return {
      title: item.name,
      description:
        item.description ??
        `${item.name} — luxury tailored menswear by Mensah. GH₵ ${item.price_ghs.toFixed(2)}.`,
      openGraph: {
        images: [{ url: item.primary_image, alt: item.name }],
      },
    };
  } catch {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  let item;
  try {
    item = await getItem(id);
  } catch {
    notFound();
  }

  let merchant;
  try {
    merchant = await getMerchant();
  } catch {
    merchant = null;
  }

  return <ProductDetail item={item} whatsappNumber={"233551694847"} />;
}
