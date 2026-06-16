import { getSettings } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { updateSettings } from '@/lib/actions';

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const settings = await getSettings(supabase);

  if (!settings) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-6">Settings</h1>
        <div className="border border-line rounded bg-white p-6 text-sm text-muted">
          No settings row found. Run <code className="font-mono">supabase/schema.sql</code> in
          your Supabase project — it seeds a default settings row.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-ink mb-6">Settings</h1>

      <form action={updateSettings} className="border border-line rounded bg-white p-6 flex flex-col gap-4">
        <input type="hidden" name="id" value={settings.id} />

        <div className="flex flex-col gap-1">
          <label htmlFor="site_name" className="text-xs font-mono uppercase tracking-wide text-muted">
            Site name
          </label>
          <input
            id="site_name"
            name="site_name"
            type="text"
            required
            defaultValue={settings.site_name}
            className="border border-line rounded px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="whatsapp_number" className="text-xs font-mono uppercase tracking-wide text-muted">
            WhatsApp number (with country code, digits only)
          </label>
          <input
            id="whatsapp_number"
            name="whatsapp_number"
            type="text"
            required
            placeholder="919876543210"
            defaultValue={settings.whatsapp_number}
            className="border border-line rounded px-3 py-2 text-sm font-mono focus-visible:outline-2 focus-visible:outline-teal"
          />
          <p className="text-xs text-muted mt-1">
            Every &ldquo;Enquire&rdquo; button across the site opens a WhatsApp
            chat to this number.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="enquiry_message_template" className="text-xs font-mono uppercase tracking-wide text-muted">
            Enquiry message template
          </label>
          <textarea
            id="enquiry_message_template"
            name="enquiry_message_template"
            rows={4}
            required
            defaultValue={settings.enquiry_message_template}
            className="border border-line rounded px-3 py-2 text-sm font-mono focus-visible:outline-2 focus-visible:outline-teal"
          />
          <p className="text-xs text-muted mt-1">
            Placeholders: <code className="font-mono">{'{product}'}</code>{' '}
            <code className="font-mono">{'{brand}'}</code>{' '}
            <code className="font-mono">{'{vendor}'}</code>{' '}
            <code className="font-mono">{'{category}'}</code>{' '}
            <code className="font-mono">{'{link}'}</code>
          </p>
        </div>

        <button
          type="submit"
          className="self-start rocker"
          data-active="true"
          style={{ backgroundColor: '#2F6E68', color: '#FAF7F1', borderColor: '#2F6E68' }}
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
