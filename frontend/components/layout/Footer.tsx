'use client';

import Link from 'next/link';
import { Anchor, Mail, Phone, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from './Container';

export function Footer() {
  const tNav = useTranslations('navigation');
  const tFooter = useTranslations('footer');
  const tLoc = useTranslations('locations');

  const navigation = {
    platform: [
      { name: tNav('boats'), href: '/boats' },
      { name: tNav('destinations'), href: '/destinations' },
      { name: tNav('howItWorks'), href: '/how-it-works' },
    ],
    support: [
      { name: tFooter('contact'), href: '/contact' },
      { name: tFooter('helpCenter'), href: '/faq' },
      { name: tFooter('terms'), href: '/terms' },
      { name: tFooter('privacy'), href: '/privacy' },
    ],
    locations: [
      { name: tLoc('porto'), href: '/destinations/porto' },
      { name: tLoc('lisbon'), href: '/destinations/lisbon' },
      { name: tLoc('algarve'), href: '/destinations/algarve' },
      { name: tLoc('saoPaulo'), href: '/destinations/sao-paulo' },
      { name: tLoc('rioDeJaneiro'), href: '/destinations/rio-de-janeiro' },
      { name: tLoc('santaCatarina'), href: '/destinations/santa-catarina' },
    ],
  };

  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Anchor className="h-6 w-6" />
              </div>
              <span className="text-xl font-heading font-semibold text-foreground">
                Villas Boats
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {tFooter('tagline')}
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:info@villasboats.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                info@villasboats.com
              </a>
              <a
                href="tel:+351123456789"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                +351 123 456 789
              </a>
              <a
                href="https://wa.me/351123456789"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                {tFooter('whatsapp')}
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-4">
              {tFooter('platform')}
            </h3>
            <ul className="space-y-2">
              {navigation.platform.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-4">
              {tFooter('support')}
            </h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-4">
              Locations
            </h3>
            <ul className="space-y-2">
              {navigation.locations.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Villas Boats. {tFooter('allRightsReserved')}
            </p>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tFooter('terms')}
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tFooter('privacy')}
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
