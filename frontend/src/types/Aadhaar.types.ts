export interface ParsedAadhaarData {
  aadhaarNumber: string | null;
  name: string | null;
  gender: string | null;
  dob: string | null;
  pincode: string | null;
  address: string | null;
  isUidSame?: boolean | null;
}

export interface ParsedResultProps {
  data: ParsedAadhaarData | null;

}
