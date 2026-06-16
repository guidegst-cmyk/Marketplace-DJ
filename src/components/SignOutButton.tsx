import { signOutAction } from '@/lib/actions';

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="text-sm text-muted hover:text-copper-dark transition-colors"
      >
        Sign out
      </button>
    </form>
  );
}
