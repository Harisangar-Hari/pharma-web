import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressList } from "@/components/account/address-list";

export const metadata = { title: "My Addresses" };

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AddressList
      addresses={addresses.map((a) => ({
        id: a.id,
        label: a.label,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        phone: a.phone,
        isDefault: a.isDefault,
      }))}
    />
  );
}