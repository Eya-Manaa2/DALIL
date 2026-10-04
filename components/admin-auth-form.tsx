'use client'

import { ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { authClient } from '@/lib/auth-client'

type Mode = 'sign-in' | 'sign-up'

export function AdminAuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    const result =
      mode === 'sign-in'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(form.get('name') ?? '').trim() || email })

    setPending(false)
    if (result.error) {
      console.error('[auth]', result.error)
      setError(
        mode === 'sign-in'
          ? 'Identifiants incorrects.'
          : "Création du compte impossible. Seules les adresses autorisées peuvent s'inscrire.",
      )
      return
    }
    router.push('/moderation')
    router.refresh()
  }

  const inputClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30'

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <h1 className="font-heading text-2xl font-semibold text-balance">
          {mode === 'sign-in' ? 'Espace de modération' : 'Créer un compte modérateur'}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Réservé aux agents habilités à valider les signalements du terrain.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {mode === 'sign-up' && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Nom
            <input name="name" autoComplete="name" className={inputClass} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          E-mail professionnel
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Mot de passe
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Patientez…' : mode === 'sign-in' ? 'Se connecter' : 'Créer le compte'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')
          setError(null)
        }}
        className="text-sm font-medium text-primary hover:underline"
      >
        {mode === 'sign-in' ? 'Première connexion ? Créer le compte' : "J'ai déjà un compte"}
      </button>
    </div>
  )
}
