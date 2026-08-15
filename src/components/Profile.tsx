import { useState } from 'react';
import { ArrowUpRight, Pencil, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { BtnPrimary, BtnSecondary, Detail, Field, inputClass } from './Shared';

export function Profile() {
  const { currentUser, updateProfile, mutating } = useAdminStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  const save = async () => {
    await updateProfile({ name, email, phone });
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b98a2c]">ACCOUNT / PROFILE</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">Your profile</h2>
          <p className="mt-1 text-sm text-stone-500">Manage your personal details and account preferences.</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            <Pencil size={16} /> Edit profile
          </button>
        )}
      </div>

      {/* Main card + side cards: stacked mobile, 2-col from lg */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-stone-200 bg-white lg:col-span-2">
          <div className="h-24 rounded-t-2xl bg-gradient-to-r from-[#d9aa3f]/30 to-[#d9aa3f]/5" />
          <div className="-mt-10 flex flex-col items-center gap-3 px-6 sm:flex-row sm:items-end">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#d9aa3f] text-xl font-semibold text-stone-900">
              {name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="pb-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-stone-900">{name}</h3>
              <p className="text-sm text-stone-500">Administrator</p>
              <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active account
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6">
            {editing ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
                  </Field>
                  <Field label="Email address">
                    <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Field>
                </div>
                <Field label="Phone number">
                  <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>
                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <BtnSecondary type="button" onClick={() => setEditing(false)}>Cancel</BtnSecondary>
                  <BtnPrimary type="button" onClick={save} disabled={mutating}>
                    {mutating ? 'Saving...' : 'Save changes'}
                  </BtnPrimary>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Full name" value={name} />
                <Detail label="Email address" value={email} />
                <Detail label="Phone number" value={phone} />
                <Detail label="Role" value="Administrator" />
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {/* <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9aa3f]/15 text-[#b98a2c]"><ShieldCheck size={20} /></div>
            <h3 className="text-base font-semibold text-stone-900">Account security</h3>
            <p className="mt-1 text-sm text-stone-500">Your account is protected with two-factor authentication.</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-stone-600">Two-factor authentication</span>
              <strong className="text-emerald-600">Enabled</strong>
            </div>
            <button className="mt-4 flex items-center gap-1 text-sm font-medium text-[#b98a2c] hover:underline">
              Manage security <ArrowUpRight size={16} />
            </button>
          </section> */}

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="text-base font-semibold text-stone-900">Recent activity</h3>
            <p className="text-sm text-stone-500">Your latest account events</p>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#d9aa3f]" />
                <div>
                  <strong className="block text-sm text-stone-900">Signed in successfully</strong>
                  <small className="text-xs text-stone-400">Today at 08:42</small>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <div>
                  <strong className="block text-sm text-stone-900">Updated a project</strong>
                  <small className="text-xs text-stone-400">Yesterday at 16:20</small>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
