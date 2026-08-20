import { useEffect, useState } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { BtnPrimary, BtnSecondary, Detail, Field, inputClass } from './Shared';
import Loading from './loading';

export function Profile() {
  const profile = useProfileStore((state) => state.profile);
  const loading = useProfileStore((state) => state.loading);
  const mutating = useProfileStore((state) => state.mutating);
  const getProfileDetails = useProfileStore((state) => state.getProfileDetails);
  const updateProfileApi = useProfileStore((state) => state.updateProfileApi);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    getProfileDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync local fields whenever the fetched profile changes (and we're not mid-edit)
  useEffect(() => {
    if (!profile || editing) return;
    setName(profile.fullName ?? '');
    setEmail(profile.email ?? '');
    setPhone(profile.mobileNumber ?? profile.mobile ?? '');
  }, [profile, editing]);

  const save = async () => {
    const result = await updateProfileApi({ name, email, phone });
    if (result) {
      getProfileDetails();
      setEditing(false)
    };
  };

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return <Loading message='Please wait, loading your data...' />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b98a2c]">
            ACCOUNT / PROFILE
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">Your profile</h2>
          <p className="mt-1 text-sm text-stone-500">
            Manage your personal details and account preferences.
          </p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-stone-200 bg-white lg:col-span-2">
          <div className="h-24 rounded-t-2xl bg-gradient-to-r from-[#d9aa3f]/30 to-[#d9aa3f]/5" />

          <div className="-mt-10 flex flex-col items-center gap-3 px-6 sm:flex-row sm:items-end">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#d9aa3f] text-xl font-semibold text-stone-900">
              {initials}
            </div>
            <div className="pb-4 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-stone-900">{name}</h3>
              <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {profile?.status?.toLocaleUpperCase()}
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
                    <input
                      className={inputClass}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Phone number">
                  <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>

                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <BtnSecondary type="button" onClick={() => setEditing(false)} disabled={mutating}>
                    Cancel
                  </BtnSecondary>

                  <BtnPrimary type="button" onClick={save} disabled={mutating}>
                    {mutating ? 'Saving...' : 'Save changes'}
                  </BtnPrimary>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Full name" value={name || '—'} />
                <Detail label="Email address" value={email || '—'} />
                <Detail label="Phone number" value={phone || '—'} />
                <Detail label="Role" value={'Administrator'} />
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-6">
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

export default Profile;