type CommonReactProps = Readonly<{
  children: React.ReactNode;
}>;

type MercadoPagoAccountDetail = {
  firstName?: string;
  lastName?: string;
  thumbnailUrl?: string;
  userName?: string;
  email?: string;
  phone?: string;
  cvu?: string;
  alias?: string;
};
