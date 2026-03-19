import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialErrors = {
  email: '',
  password: ''
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  const validate = () => {
    const nextErrors = { ...initialErrors };

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (password.trim().length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 850));
    navigate('/pipeline', { state: { rememberMe } });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-surface text-on-surface">
      <a href="#login-form" className="skip-link">Skip to login form</a>

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(128,131,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(79,219,200,0.1),transparent_24%)]"></div>
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-80"></div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-5xl overflow-hidden rounded-[1.25rem] border border-outline-variant/30 bg-surface-container shadow-[0_40px_120px_rgba(3,7,18,0.45)]">
          <div className="grid min-h-[720px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <section className="relative hidden overflow-hidden border-r border-outline-variant/20 bg-[linear-gradient(180deg,rgba(24,31,50,0.96),rgba(12,19,38,1))] lg:flex lg:flex-col lg:justify-between lg:px-10 lg:py-10">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 shadow-[0_0_28px_rgba(192,193,255,0.1)]">
                    <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
                  </div>
                  <div>
                    <h1 className="font-headline text-5xl italic tracking-tight text-primary">WriteLens</h1>
                    <p className="data-label !text-[9px] !tracking-[0.28em] opacity-70">DOCTORAL RESEARCH ACCESS</p>
                  </div>
                </div>

                <div className="mt-14 max-w-md">
                  <p className="data-label !text-[9px] !tracking-[0.26em] text-secondary">Forensic Editorial Platform</p>
                  <h2 className="mt-4 font-headline text-4xl italic leading-tight text-on-surface">
                    Sign in to your research cockpit.
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
                    The screen now follows the stronger design language from your `Design` folder:
                    clearer hierarchy, higher contrast, and a more controlled academic dashboard mood.
                  </p>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Cohort tracking', value: '28 students', tone: 'primary' },
                    { label: 'Engagement signal', value: '61% live', tone: 'secondary' },
                    { label: 'At-risk watchlist', value: '5 flagged', tone: 'tertiary' },
                    { label: 'Analysis workflow', value: '12 stations', tone: 'primary' }
                  ].map((item) => (
                    <article key={item.label} className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-4">
                      <p className="data-label !text-[8px] !tracking-[0.2em] opacity-70">{item.label}</p>
                      <p className={`mt-3 text-2xl font-semibold ${
                        item.tone === 'primary' ? 'text-primary' :
                        item.tone === 'secondary' ? 'text-secondary' :
                        'text-tertiary'
                      }`}>
                        {item.value}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low px-5 py-5">
                <p className="data-label !text-[9px] !tracking-[0.22em] text-primary">Research Principle</p>
                <blockquote className="mt-3 font-headline text-xl italic leading-relaxed text-on-surface-variant">
                  "Learning analytics is the measurement, collection, analysis and reporting of data about learners and their contexts."
                </blockquote>
                <cite className="mt-4 block text-sm text-outline not-italic">Siemens & Gasevic, 2012</cite>
              </div>
            </section>

            <section className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-10">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 lg:hidden">
                  <p className="font-headline text-4xl italic tracking-tight text-primary">WriteLens</p>
                  <p className="mt-2 text-sm text-outline">Doctoral research access</p>
                </div>

                <div className="mb-8">
                  <p className="data-label !text-[9px] !tracking-[0.22em] text-primary">Secure Access</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-on-surface">Researcher sign in</h2>
                  <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                    Enter any valid email and any password with 6+ characters to access the prototype workspace.
                  </p>
                </div>

                <form id="login-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="space-y-2">
                    <label className="font-label text-sm text-on-surface" htmlFor="email">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={validate}
                      placeholder="scholar@university.edu"
                      aria-describedby={errors.email ? 'email-error' : 'email-help'}
                      aria-invalid={Boolean(errors.email)}
                      className={`
                        w-full rounded-xl border bg-surface-container-highest px-4 py-3 text-base text-on-surface
                        outline-none transition-colors placeholder:text-outline/70
                        ${errors.email ? 'border-error' : 'border-outline-variant/30 focus:border-primary'}
                      `}
                    />
                    {errors.email ? (
                      <p id="email-error" className="text-sm text-error" role="alert">{errors.email}</p>
                    ) : (
                      <p id="email-help" className="text-sm text-outline">Use your institutional or research email.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="font-label text-sm text-on-surface" htmlFor="password">Password</label>
                      <button
                        type="button"
                        className="text-sm text-primary transition-colors hover:text-secondary"
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? 'Hide password' : 'Show password'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onBlur={validate}
                        placeholder="••••••••"
                        aria-describedby={errors.password ? 'password-error' : 'password-help'}
                        aria-invalid={Boolean(errors.password)}
                        className={`
                          w-full rounded-xl border bg-surface-container-highest px-4 py-3 pr-12 text-base text-on-surface
                          outline-none transition-colors placeholder:text-outline/70
                          ${errors.password ? 'border-error' : 'border-outline-variant/30 focus:border-primary'}
                        `}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </span>
                    </div>
                    {errors.password ? (
                      <p id="password-error" className="text-sm text-error" role="alert">{errors.password}</p>
                    ) : (
                      <p id="password-help" className="text-sm text-outline">Prototype access only. Minimum 6 characters.</p>
                    )}
                  </div>

                  <label className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-outline-variant/30 bg-surface-container-highest text-primary"
                    />
                    <span className="text-sm text-on-surface-variant">Remember me for the next session</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-on-primary-fixed shadow-[0_18px_36px_rgba(128,131,255,0.24)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span>{isSubmitting ? 'Initializing...' : 'Initialize Analysis'}</span>
                    {isSubmitting && (
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    )}
                  </button>
                </form>

                <div className="mt-8 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-5 py-5">
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    Unauthorized access is restricted to <span className="font-semibold text-secondary">whitelisted domains</span>.
                    Institutional access requests and onboarding documentation remain available below.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href="#" className="rounded-md border border-outline-variant/30 px-4 py-2 text-sm text-outline transition-colors hover:text-primary">Documentation</a>
                    <a href="#" className="rounded-md border border-outline-variant/30 px-4 py-2 text-sm text-outline transition-colors hover:text-primary">Security</a>
                    <a href="#" className="rounded-md border border-outline-variant/30 px-4 py-2 text-sm text-outline transition-colors hover:text-primary">Request Access</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
