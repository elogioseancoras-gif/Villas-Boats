'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Search, MessageSquare, CheckCircle, Anchor, ShieldCheck, DollarSign, MapPin, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HowItWorksPage() {
  const t = useTranslations('howItWorks');
  const tCommon = useTranslations();
  const locale = useLocale();

  const steps = [
    {
      number: 1,
      icon: Search,
      title: t('step1Title'),
      description: t('step1Description'),
    },
    {
      number: 2,
      icon: MessageSquare,
      title: t('step2Title'),
      description: t('step2Description'),
    },
    {
      number: 3,
      icon: CheckCircle,
      title: t('step3Title'),
      description: t('step3Description'),
    },
    {
      number: 4,
      icon: Anchor,
      title: t('step4Title'),
      description: t('step4Description'),
    },
  ];

  const whyChoose = [
    {
      icon: ShieldCheck,
      title: t('whyChoose1Title'),
      description: t('whyChoose1Description'),
    },
    {
      icon: DollarSign,
      title: t('whyChoose2Title'),
      description: t('whyChoose2Description'),
    },
    {
      icon: MapPin,
      title: t('whyChoose3Title'),
      description: t('whyChoose3Description'),
    },
    {
      icon: Headphones,
      title: t('whyChoose4Title'),
      description: t('whyChoose4Description'),
    },
  ];

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('title'),
    description: t('description'),
    step: steps.map((step) => ({
      '@type': 'HowToStep',
      position: step.number,
      name: step.title,
      text: step.description,
    })),
    totalTime: 'PT30M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Anchor className="h-3 w-3 mr-1" />
              {tCommon('navigation.howItWorks')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full flex items-start justify-end p-3">
                    <span className="text-2xl font-bold text-primary/20">
                      {step.number}
                    </span>
                  </div>
                  <CardHeader>
                    <div className="mb-4 p-3 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('whyChooseTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">{t('safetyTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-lg">
                  {t('safetyDescription')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              {t('readyTitle')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('readyDescription')}
            </p>
            <Button asChild size="lg">
              <a href={`/${locale}/boats`}>
                {t('browseBoats')}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
