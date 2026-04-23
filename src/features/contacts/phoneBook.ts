export interface PhoneBookContact {
  id: string;
  name: string;
  phone: string;
  relation?: string;
  initials: string;
  source: "device" | "fallback";
}

interface DeviceContactRecord {
  name?: string[];
  tel?: string[];
}

declare global {
  interface Navigator {
    contacts?: {
      select: (
        properties: Array<"name" | "tel">,
        options: { multiple: boolean }
      ) => Promise<DeviceContactRecord[]>;
    };
  }
}

const FALLBACK_PHONE_BOOK_CONTACTS: Array<{ name: string; phone: string; relation: string }> = [
  { name: "John Doe", phone: "+256 772 987654", relation: "Friend" },
  { name: "Mary Nansubuga", phone: "+256 701 123456", relation: "Sister" },
  { name: "Brian Kato", phone: "+256 774 553201", relation: "Brother" },
  { name: "Amina Namuli", phone: "+256 783 221908", relation: "Colleague" },
  { name: "Nurse Sarah", phone: "+256 414 554201", relation: "Clinic" },
  { name: "Rachel Zoe", phone: "+256 777 777777", relation: "Saved contact" }
];

function createPhoneBookId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export function getPhoneBookInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "PB";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function toPhoneBookContact(
  name: string,
  phone: string,
  relation = "Phone book",
  source: PhoneBookContact["source"] = "fallback"
): PhoneBookContact {
  return {
    id: createPhoneBookId(source),
    name: name.trim(),
    phone: phone.trim(),
    relation,
    initials: getPhoneBookInitials(name),
    source
  };
}

export function getFallbackPhoneBookContacts(): PhoneBookContact[] {
  return FALLBACK_PHONE_BOOK_CONTACTS.map((contact) =>
    toPhoneBookContact(contact.name, contact.phone, contact.relation, "fallback")
  );
}

export function canUseDevicePhoneBook(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.contacts?.select === "function";
}

export async function pickDevicePhoneBookContact(): Promise<PhoneBookContact | null> {
  if (!canUseDevicePhoneBook()) {
    return null;
  }

  const contacts = await navigator.contacts!.select(["name", "tel"], { multiple: false });
  const selection = contacts[0];
  const name = selection?.name?.find((value) => value.trim().length > 0) ?? "";
  const phone = selection?.tel?.find((value) => value.trim().length > 0) ?? "";

  if (!name || !phone) {
    return null;
  }

  return toPhoneBookContact(name, phone, "Phone book", "device");
}
