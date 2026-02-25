import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+48", country: "PL", flag: "🇵🇱", name: "Poland" },
  { code: "+90", country: "TR", flag: "🇹🇷", name: "Turkey" },
  { code: "+62", country: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "+60", country: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "+63", country: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "+66", country: "TH", flag: "🇹🇭", name: "Thailand" },
  { code: "+84", country: "VN", flag: "🇻🇳", name: "Vietnam" },
  { code: "+92", country: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", country: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94", country: "LK", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", country: "NP", flag: "🇳🇵", name: "Nepal" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+234", country: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "+254", country: "KE", flag: "🇰🇪", name: "Kenya" },
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
  (
    {
      value,
      countryCode = "+91",
      onValueChange,
      onCountryChange,
      placeholder = "Enter Phone Number",
      className,
      disabled,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const selectedCountry =
      countries.find((c) => c.code === countryCode) || countries[0];

    return (
      <div className={cn("flex gap-3", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className="flex items-center justify-between gap-2 h-12 px-4 bg-white border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all min-w-[120px] text-sm"
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="text-black font-black uppercase tracking-tight">
                {selectedCountry.code}
              </span>
              <ChevronDown className="h-4 w-4 text-black stroke-[3px]" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[280px] p-0 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[100] rounded-none"
            align="start"
            side="bottom"
            sideOffset={8}
          >
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-1">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onCountryChange?.(country.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 border-2 border-transparent hover:border-black hover:bg-[#E9E9E9] transition-all text-left",
                      countryCode === country.code &&
                        "bg-[#E9E9E9] border-black",
                    )}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-black uppercase tracking-widest text-black">
                        {country.name}
                      </span>
                    </div>
                    <span className="text-xs text-black/50 font-black">
                      {country.code}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <Input
          ref={ref}
          type="tel"
          value={value}
          onChange={(e) => onValueChange?.(e.target.value.replace(/\D/g, ""))}
          placeholder={placeholder}
          className="flex-1 h-12 bg-[#E9E9E9] border-4 border-black text-black font-bold focus:ring-0 focus:border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none placeholder:text-black/30"
          disabled={disabled}
          maxLength={15}
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput, countries };
