import { Input } from "../ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function LeadSearchBar({ value, onChange }: Props) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by name, company, phone, or source"
    />
  );
}

