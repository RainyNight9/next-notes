import { signIn, signOut, auth } from "@/auth";

interface SignInProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: string;
}

interface SignOutProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function SignIn({ provider, ...props }: SignInProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <button {...props}>Sign In</button>
    </form>
  );
}

function SignOut(props: SignOutProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button {...props}>Sign Out</button>
    </form>
  );
}

export default async function Header() {
  const session = await auth();
  return (
    <header style={{ display: "flex", justifyContent: "space-around" }}>
      {session?.user ? (
        <span style={{ display: "flex", alignItems: "center" }}>
          {session?.user.name}
          <SignOut />
        </span>
      ) : (
        <SignIn provider="yourProviderHere" />
      )}
    </header>
  );
}
