import { Metadata } from 'next';
import { getBoatBySlug } from '@/lib/boats';
import { Language } from '@/types';

interface Props {
  params: { slug: string; locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const boat = getBoatBySlug(params.slug);
  const locale = params.locale as Language;

  if (!boat) {
    return {
      title: 'Boat Not Found | Villas Boats',
      description: 'The requested boat could not be found.',
    };
  }

  const title = boat.name[locale];
  const description = boat.description[locale];
  const imageUrl = boat.images[0]?.url || '/default-boat.jpg';
  const url = `https://villasboats.com/${locale}/boats/${params.slug}`;

  return {
    title: `${title} | Villas Boats`,
    description: description,
    keywords: [
      'boat rental',
      'yacht charter',
      boat.type.toLowerCase(),
      boat.location.city,
      boat.location.country,
      'boat hire',
      'sailing',
    ],
    authors: [{ name: 'Villas Boats' }],
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: 'Villas Boats',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
