import { useState } from 'react'
import { PageTransition } from '../ui/PageTransition'
import { Button } from '../ui/Button'
import { ConfirmModal } from '../ui/ConfirmModal'
import { ScreenHeader } from '../ui/ScreenHeader'
import { FadeIn } from '../ui/FadeIn'
import { SectionLabel } from '../ui/SectionLabel'
import { useAuthStore } from '../../stores/auth'
import { axiosService } from '../../services/AxiosService'
import { endpoints } from '../../config/api'
import Cookies from 'js-cookie'

export function ProfileScreen() {
  const { user, logout } = useAuthStore()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleLogout() {
    try {
      await axiosService.post(endpoints.auth.logout || '/auth/logout')
    } catch {}
    Cookies.remove('kith_access')
    logout()
  }

  async function handleDeleteAccount() {
    try {
      await axiosService.delete(endpoints.auth.me)
    } catch {}
    Cookies.remove('kith_access')
    setShowDeleteConfirm(false)
    logout()
  }
  const initial = user?.firstName?.[0] || user?.email?.[0] || 'K'

  return (
    <PageTransition>
      <div className="pt-6 pb-12">
        <ScreenHeader catState="idle" message="Profile" />

        <FadeIn delay={0.05} className="flex items-center gap-5 mb-12">
          <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-olive">{initial.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-12">
          <SectionLabel className="mb-5">Account</SectionLabel>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-text-primary">Name</span>
            <span className="text-sm text-text-muted">{user?.firstName} {user?.lastName}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-text-primary">Email</span>
            <span className="text-sm text-text-muted">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-text-primary">Sign-in method</span>
            <span className="text-sm text-text-muted">
              {user?.providers?.includes('GOOGLE') && user?.providers?.includes('EMAIL')
                ? 'Google + Email'
                : user?.providers?.includes('GOOGLE')
                  ? 'Google'
                  : 'Email'}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-text-primary">Google account</span>
            {user?.providers?.includes('GOOGLE') ? (
              <span className="text-sm text-connection">Linked</span>
            ) : (
              <Button variant="ghost" size="sm" label="Link Google" />
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.15} y={0} className="flex gap-4">
          <Button variant="ghost" size="sm" label="Sign out" onClick={handleLogout} />
          <Button variant="danger" size="sm" label="Delete account" onClick={() => setShowDeleteConfirm(true)} />
        </FadeIn>

        <ConfirmModal
          visible={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
          title="Delete account"
          message="This will permanently delete your account and all your data. This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
        />
      </div>
    </PageTransition>
  )
}
