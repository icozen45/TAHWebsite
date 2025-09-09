import { prisma } from '@/lib/prisma';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return (
    <AnalyticsClient
      totalReviews={totalReviews}
      averageRating={averageRating}
      reviews={reviews}
    />
  );
}
