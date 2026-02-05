import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
];

interface PhoneInputProps {
  value?: string;
  countryCode?: string;
  onValueChange?: (phone: string) => void;
  onCountryChange?: (code: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, countryCode = "+91", onValueChange, onCountryChange, placeholder = "9876543210", className, disabled }, ref) => {
    return (
      <div className={cn("flex gap-2", className)}>
        <Select value={countryCode} onValueChange={onCountryChange} disabled={disabled}>
          <SelectTrigger className="w-[100px] h-12 bg-background border-input shrink-0">
            <SelectValue>
              {countries.find(c => c.code === countryCode)?.flag} {countryCode}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.code}</span>
                  <span className="text-muted-foreground text-xs">{country.country}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          ref={ref}
          type="tel"
          value={value}
          onChange={(e) => onValueChange?.(e.target.value.replace(/\D/g, ''))}
          placeholder={placeholder}
          className="flex-1 h-12 bg-background text-foreground border-input"
          disabled={disabled}
          maxLength={15}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput, countries };
