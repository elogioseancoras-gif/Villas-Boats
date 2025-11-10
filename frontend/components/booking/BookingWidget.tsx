'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Users, Anchor, Mail, Phone, User, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createInquiry } from '@/lib/api/inquiries';
import { toast } from 'sonner';
import type { I18nString, Language } from '@/types/api';

interface Boat {
  id: string;
  name: I18nString;
  slug: string;
  pricePerDayUsd: number;
  pricePerDayEur: number;
  pricePerDayGbp: number;
  pricePerDayBrl: number;
  captainPricePerDayUsd?: number;
  captainPricePerDayEur?: number;
  captainPricePerDayGbp?: number;
  captainPricePerDayBrl?: number;
  capacity: number;
}

interface BookingWidgetProps {
  boat: Boat;
  locale: string;
  onSuccess?: (bookingReference: string) => void;
}

type Currency = 'USD' | 'EUR' | 'GBP' | 'BRL';

interface FormErrors {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  guestCount?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export function BookingWidget({ boat, locale, onSuccess }: BookingWidgetProps) {
  const t = useTranslations('booking');
  const tCommon = useTranslations('common');

  // Form state
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('18:00');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [needsCaptain, setNeedsCaptain] = useState(false);
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Set minimum date to tomorrow
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  // Calculate number of days
  const daysCount = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate + 'T' + startTime);
    const end = new Date(endDate + 'T' + endTime);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 1 ? 1 : diffDays; // Minimum 1 day (same-day bookings)
  }, [startDate, startTime, endDate, endTime]);

  // Calculate prices
  const prices = useMemo(() => {
    const boatPricePerDay = {
      USD: boat.pricePerDayUsd,
      EUR: boat.pricePerDayEur,
      GBP: boat.pricePerDayGbp,
      BRL: boat.pricePerDayBrl,
    }[currency];

    const captainPricePerDay = needsCaptain ? {
      USD: boat.captainPricePerDayUsd || 0,
      EUR: boat.captainPricePerDayEur || 0,
      GBP: boat.captainPricePerDayGbp || 0,
      BRL: boat.captainPricePerDayBrl || 0,
    }[currency] : 0;

    const boatSubtotal = boatPricePerDay * daysCount;
    const captainSubtotal = captainPricePerDay * daysCount;
    const subtotal = boatSubtotal + captainSubtotal;
    const tax = 0; // No tax currently
    const total = subtotal + tax;

    return {
      boatPricePerDay,
      captainPricePerDay,
      boatSubtotal,
      captainSubtotal,
      subtotal,
      tax,
      total,
    };
  }, [boat, currency, needsCaptain, daysCount]);

  // Currency symbols
  const currencySymbol = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    BRL: 'R$',
  }[currency];

  // Form validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Date validations
    if (!startDate) {
      newErrors.startDate = t('errors.startDateRequired');
    }
    if (!endDate) {
      newErrors.endDate = t('errors.endDateRequired');
    }
    if (startDate && endDate) {
      const start = new Date(startDate + 'T' + startTime);
      const end = new Date(endDate + 'T' + endTime);
      if (end < start) {
        newErrors.endDate = t('errors.endDateBeforeStart');
      }
    }

    // Guest count validation
    if (guestCount < 1) {
      newErrors.guestCount = t('errors.minGuests');
    }
    if (guestCount > boat.capacity) {
      newErrors.guestCount = t('errors.maxGuests', { max: boat.capacity });
    }

    // Customer info validations
    if (!fullName.trim()) {
      newErrors.fullName = t('errors.nameRequired');
    }
    if (!email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    if (!phone.trim()) {
      newErrors.phone = t('errors.phoneRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error(t('errors.validationFailed'));
      return;
    }

    setIsSubmitting(true);

    try {
      const startDatetime = new Date(startDate + 'T' + startTime).toISOString();
      const endDatetime = new Date(endDate + 'T' + endTime).toISOString();

      const response = await createInquiry({
        boatId: boat.id,
        startDatetime,
        endDatetime,
        guestCount,
        needsCaptain,
        currency,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        customerNotes: customerNotes.trim() || undefined,
      });

      toast.success(t('success.title'), {
        description: t('success.description', { reference: response.bookingReference }),
      });

      if (onSuccess) {
        onSuccess(response.bookingReference);
      }

      // Reset form
      setStartDate('');
      setEndDate('');
      setGuestCount(2);
      setNeedsCaptain(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setCustomerNotes('');
      setErrors({});
    } catch (error: any) {
      console.error('Booking inquiry error:', error);
      toast.error(t('errors.submissionFailed'), {
        description: error.response?.data?.message || t('errors.tryAgain'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description', { boat: boat.name[locale as Language] || boat.name.en || '' })}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label htmlFor="currency">{t('currency')}</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="BRL">BRL (R$)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">
                <Calendar className="inline h-4 w-4 mr-1" />
                {t('startDate')}
              </Label>
              <Input
                id="start-date"
                type="date"
                min={minDate}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={errors.startDate ? 'border-destructive' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time">{t('startTime')}</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">
                <Calendar className="inline h-4 w-4 mr-1" />
                {t('endDate')}
              </Label>
              <Input
                id="end-date"
                type="date"
                min={startDate || minDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={errors.endDate ? 'border-destructive' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">{t('endTime')}</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-2">
            <Label htmlFor="guest-count">
              <Users className="inline h-4 w-4 mr-1" />
              {t('guestCount')}
            </Label>
            <Input
              id="guest-count"
              type="number"
              min={1}
              max={boat.capacity}
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              className={errors.guestCount ? 'border-destructive' : ''}
            />
            {errors.guestCount && (
              <p className="text-sm text-destructive">{errors.guestCount}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {t('maxCapacity', { max: boat.capacity })}
            </p>
          </div>

          {/* Captain Selection */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="captain" className="text-base">
                <Anchor className="inline h-4 w-4 mr-1" />
                {t('needsCaptain')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('captainDescription')}
              </p>
            </div>
            <Switch
              id="captain"
              checked={needsCaptain}
              onCheckedChange={setNeedsCaptain}
            />
          </div>

          {/* Price Summary */}
          {daysCount > 0 && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <h4 className="font-semibold">{t('priceBreakdown')}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{t('boatPrice', { days: daysCount })}</span>
                  <span>{currencySymbol}{prices.boatSubtotal.toFixed(2)}</span>
                </div>
                {needsCaptain && prices.captainSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span>{t('captainPrice', { days: daysCount })}</span>
                    <span>{currencySymbol}{prices.captainSubtotal.toFixed(2)}</span>
                  </div>
                )}
                {prices.tax > 0 && (
                  <div className="flex justify-between">
                    <span>{t('tax')}</span>
                    <span>{currencySymbol}{prices.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-semibold text-base">
                  <span>{t('total')}</span>
                  <span>{currencySymbol}{prices.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4 border-t pt-6">
            <h4 className="font-semibold">{t('customerInfo')}</h4>

            <div className="space-y-2">
              <Label htmlFor="full-name">
                <User className="inline h-4 w-4 mr-1" />
                {t('fullName')}
              </Label>
              <Input
                id="full-name"
                type="text"
                placeholder={t('fullNamePlaceholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-1" />
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-1" />
                {t('phone')}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                {t('notes')} ({t('optional')})
              </Label>
              <Textarea
                id="notes"
                placeholder={t('notesPlaceholder')}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {customerNotes.length}/1000
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || daysCount === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
