'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, MessageCircle, Mail, Phone } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string; reference: string }>;
}

export default function BookingConfirmationPage({ params }: PageProps) {
  const { locale, reference } = use(params);
  const t = useTranslations('booking');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen py-16">
      <Container className="max-w-3xl">
        {/* Success Message */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/20">
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-heading font-bold text-foreground lg:text-4xl">
            {t('success.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('success.description', { reference })}
          </p>
        </div>

        {/* Booking Reference Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {tCommon('bookingReference', { reference })}
            </CardTitle>
            <CardDescription className="text-center">
              {tCommon('saveThisReference')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-6 text-center">
              <div className="font-mono text-3xl font-bold tracking-wider text-foreground">
                {reference}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{tCommon('nextSteps')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-foreground">
                  {tCommon('checkEmail')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tCommon('checkEmailDescription')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-foreground">
                  {tCommon('awaitConfirmation')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tCommon('awaitConfirmationDescription')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-foreground">
                  {tCommon('prepareDocuments')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tCommon('prepareDocumentsDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{tCommon('needHelp')}</CardTitle>
            <CardDescription>
              {tCommon('needHelpDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <a
                href={`https://wa.me/351912345678?text=Booking reference: ${reference}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {tCommon('contactWhatsApp')}
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <a href="mailto:info@villasboats.com">
                <Mail className="mr-2 h-5 w-5" />
                {tCommon('contactEmail')}
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <a href="tel:+351912345678">
                <Phone className="mr-2 h-5 w-5" />
                {tCommon('contactPhone')}
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/boats`}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              {tCommon('browseMoreBoats')}
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href={`/${locale}`}>
              {tCommon('backToHome')}
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
