"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

type Section = "profile" | "security" | "preferences" | "appearance" | "language" | "privacy" | "data";

type Profile = {
  username: string | null;
  avatar_url: string | null;
};

type Preferences = {
  streaming_services: string[];
  genres: string[];
  mood: string | null;
  energy: string | null;
  duration: string | null;
  discovery: string | null;
  max_age: string | null;
  allow_adult: boolean;
};

const streamingServices = [
  "Netflix",
  "Prime Video",
  "Disney+",
  "Apple TV+",
  "Max",
  "Canal+",
];

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Horror",
  "Animation",
];

const moods = [
  { value: "Laugh", label: "Rire" },
  { value: "Think", label: "Réfléchir" },
  { value: "Cry", label: "Pleurer" },
  { value: "Feel inspired", label: "Être inspiré" },
  { value: "Adventure", label: "Partir à l'aventure" },
  { value: "Be scared", label: "Avoir peur" },
];

const energies = [
  { value: "Slow & atmospheric", label: "Lent et atmosphérique" },
  { value: "Balanced", label: "Équilibré" },
  { value: "Fast & intense", label: "Rapide et intense" },
];

const durations = [
  { value: "Under 90 minutes", label: "Moins de 90 minutes" },
  { value: "Under 2 hours", label: "Moins de 2 heures" },
  { value: "No preference", label: "Aucune préférence" },
];

const discoveries = [
  { value: "Something iconic", label: "Quelque chose d'iconique" },
  { value: "A hidden gem", label: "Une pépite méconnue" },
  { value: "Surprise me", label: "Surprenez-moi" },
];

const maxAges = [
  { value: "all", label: "Tout public" },
  { value: "10", label: "10+" },
  { value: "12", label: "12+" },
  { value: "16", label: "16+" },
  { value: "18", label: "18+" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("profile");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preferences, setPreferences] = useState<Preferences>({
    streaming_services: [],
    genres: [],
    mood: null,
    energy: null,
    duration: null,
    discovery: null,
    max_age: null,
    allow_adult: false,
  });
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const [{ data: profile }, { data: preferencesData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("user_preferences")
          .select("streaming_services, genres, mood, energy, duration, discovery, max_age, allow_adult")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      setUserId(user.id);
      setEmail(user.email || "");
      setNewEmail(user.email || "");
      setUsername(
        profile?.username ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "",
      );
      setAvatarUrl(profile?.avatar_url || "");
      setPreferences({
        streaming_services: preferencesData?.streaming_services || [],
        genres: preferencesData?.genres || [],
        mood: preferencesData?.mood || null,
        energy: preferencesData?.energy || null,
        duration: preferencesData?.duration || null,
        discovery: preferencesData?.discovery || null,
        max_age: preferencesData?.max_age || null,
        allow_adult: preferencesData?.allow_adult || false,
      });
      setLoading(false);
    }

    loadSettings();
  }, [router]);

  function clearMessages() {
    setError("");
    setProfileMessage("");
    setEmailMessage("");
    setPasswordMessage("");
    setPreferencesMessage("");
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();
    setSavingProfile(true);

    const supabase = createClient();
    let finalAvatarUrl = avatarUrl;

    if (selectedFile) {
      setUploadingAvatar(true);

      const extension = selectedFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${userId}/avatar.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, selectedFile, {
          upsert: true,
          contentType: selectedFile.type,
        });

      if (uploadError) {
        setError("Impossible d'envoyer cette photo. Vérifiez que le stockage des avatars est configuré.");
        setUploadingAvatar(false);
        setSavingProfile(false);
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      finalAvatarUrl = data.publicUrl;
      setAvatarUrl(finalAvatarUrl);
      setSelectedFile(null);
      setUploadingAvatar(false);
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: username.trim() || null,
        avatar_url: finalAvatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      setError("Impossible d'enregistrer votre profil.");
      setSavingProfile(false);
      return;
    }

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        full_name: username.trim() || null,
        avatar_url: finalAvatarUrl || null,
      },
    });

    if (metadataError) {
      setError("Votre profil a été enregistré, mais la synchronisation du compte a échoué.");
      setSavingProfile(false);
      return;
    }

    setProfileMessage("Votre profil a été enregistré.");
    setSavingProfile(false);
    router.refresh();
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();
    setSavingEmail(true);

    if (!newEmail.trim()) {
      setError("Veuillez renseigner une adresse e-mail.");
      setSavingEmail(false);
      return;
    }

    if (newEmail.trim().toLowerCase() === email.toLowerCase()) {
      setEmailMessage("Cette adresse e-mail est déjà associée à votre compte.");
      setSavingEmail(false);
      return;
    }

    const supabase = createClient();

    const { error: emailError } = await supabase.auth.updateUser({
      email: newEmail.trim(),
    });

    if (emailError) {
      setError("Impossible de modifier votre adresse e-mail.");
      setSavingEmail(false);
      return;
    }

    setEmailMessage("Un e-mail de confirmation a été envoyé à votre nouvelle adresse.");
    setSavingEmail(false);
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();
    setSavingPassword(true);

    if (!currentPassword) {
      setError("Entrez votre mot de passe actuel.");
      setSavingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      setSavingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les deux nouveaux mots de passe ne correspondent pas.");
      setSavingPassword(false);
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setError("Impossible de récupérer votre adresse e-mail.");
      setSavingPassword(false);
      return;
    }

    const { error: verificationError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verificationError) {
      setError("Votre mot de passe actuel est incorrect.");
      setSavingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError("Impossible de modifier votre mot de passe.");
      setSavingPassword(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Votre mot de passe a été modifié.");
    setSavingPassword(false);
  }

  async function handlePreferencesSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();
    setSavingPreferences(true);
    const supabase = createClient();
    const { error: preferencesError } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          streaming_services: preferences.streaming_services,
          genres: preferences.genres,
          mood: preferences.mood,
          energy: preferences.energy,
          duration: preferences.duration,
          discovery: preferences.discovery,
          max_age: preferences.max_age,
          allow_adult: preferences.allow_adult,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );
    if (preferencesError) {
      setError("Impossible d'enregistrer vos préférences.");
      setSavingPreferences(false);
      return;
    }
    setPreferencesMessage("Vos préférences ont été enregistrées.");
    setSavingPreferences(false);
  }

  function toggleGenre(genre: string) {
    setPreferences((current) => ({
      ...current,
      genres: current.genres.includes(genre)
        ? current.genres.filter((item) => item !== genre)
        : [...current.genres, genre],
    }));
  }

  function toggleStreamingService(service: string) {
    setPreferences((current) => ({
      ...current,
      streaming_services: current.streaming_services.includes(service)
        ? current.streaming_services.filter((item) => item !== service)
        : [...current.streaming_services, service],
    }));
  }

  async function handleLogout() {
    setLoggingOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.replace("/");
    router.refresh();
  }

  function handleDeleteAccount() {
    const confirmed = window.confirm(
      "La suppression de votre compte est définitive. Vos données, favoris, films vus et évaluations seront supprimés. Continuer ?",
    );

    if (!confirmed) {
      return;
    }

    setError("La suppression définitive du compte sera activée lorsque la route sécurisée de suppression sera ajoutée.");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f5f7] text-[#1d1d1f] dark:bg-black dark:text-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="h-6 w-32 animate-pulse rounded-full bg-black/[0.06] dark:bg-white/[0.08]" />
        </main>
        <Footer />
      </div>
    );
  }

  const initial =
    username.trim().charAt(0).toUpperCase() ||
    email.charAt(0).toUpperCase() ||
    "U";

  const menuSections = [
    {
      title: "Compte",
      items: [
        { id: "profile" as Section, label: "Informations personnelles" },
        { id: "security" as Section, label: "Sécurité" },
      ],
    },
    {
      title: "Application",
      items: [
        { id: "preferences" as Section, label: "Préférences" },
        { id: "appearance" as Section, label: "Apparence" },
        { id: "language" as Section, label: "Langue" },
      ],
    },
    {
      title: "Données",
      items: [
        { id: "privacy" as Section, label: "Confidentialité" },
        { id: "data" as Section, label: "Mes données" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7] text-[#1d1d1f] dark:bg-black dark:text-white">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-20 sm:px-8 sm:pt-24 lg:px-10">
          <header className="mb-10">
            <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
              Configuration
            </p>
            <h1 className="mt-2 text-[42px] font-semibold tracking-[-0.055em] sm:text-[52px]">
              Réglages
            </h1>
          </header>
          <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
            <aside className="h-fit rounded-[28px] border border-black/[0.06] bg-white/55 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.04)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055] lg:sticky lg:top-24">
              {menuSections.map((group) => (
                <div key={group.title} className="mb-5 last:mb-0">
                  <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/35 dark:text-white/35">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          clearMessages();
                          setSection(item.id);
                        }}
                        className={`w-full rounded-[16px] px-3 py-2.5 text-left text-[14px] font-medium transition-all ${
                          section === item.id
                            ? "bg-black/[0.07] text-black dark:bg-white/[0.1] dark:text-white"
                            : "text-black/55 hover:bg-black/[0.035] hover:text-black dark:text-white/55 dark:hover:bg-white/[0.05] dark:hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-5 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-[16px] px-3 py-2.5 text-left text-[14px] font-medium text-black/50 transition-colors hover:bg-black/[0.035] hover:text-black disabled:opacity-50 dark:text-white/50 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  {loggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="w-full rounded-[16px] px-3 py-2.5 text-left text-[14px] font-medium text-red-600 transition-colors hover:bg-red-500/[0.06] dark:text-red-400 dark:hover:bg-red-400/[0.06]"
                >
                  Supprimer mon compte
                </button>
              </div>
            </aside>
            <div className="min-w-0">
              {error && (
                <div className="mb-6 rounded-[22px] bg-red-500/10 px-5 py-4 text-[14px] leading-6 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              {section === "profile" && (
                <section className="rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
                  <div className="border-b border-black/[0.06] px-7 py-7 dark:border-white/[0.08] sm:px-10">
                    <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                      Compte
                    </p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
                      Informations personnelles
                    </h2>
                    <p className="mt-2 text-[14px] leading-6 text-black/40 dark:text-white/40">
                      Modifiez les informations visibles sur votre compte FindMovie.
                    </p>
                  </div>
                  <form onSubmit={handleProfileSubmit} className="px-7 py-8 sm:px-10">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full border border-black/[0.07] bg-white/60 text-[30px] font-medium shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-3xl dark:border-white/[0.1] dark:bg-white/[0.08]">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          initial
                        )}
                      </div>
                      <label className="mt-5 inline-flex h-10 cursor-pointer items-center rounded-full border border-black/[0.08] bg-white/65 px-5 text-[14px] font-medium shadow-[0_5px_20px_rgba(0,0,0,0.04)] transition hover:bg-white/85 dark:border-white/[0.1] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]">
                        {uploadingAvatar ? "Envoi..." : "Modifier la photo"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            if (file) {
                              setSelectedFile(file);
                              setAvatarUrl(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                      <p className="mt-2 text-[12px] text-black/35 dark:text-white/35">
                        JPG, PNG ou WebP
                      </p>
                    </div>
                    <div className="mt-10 space-y-6">
                      <div>
                        <label htmlFor="username" className="mb-2 block text-[13px] font-medium text-black/55 dark:text-white/55">
                          Nom ou pseudo
                        </label>
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          className="h-12 w-full rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none transition focus:border-black/20 focus:bg-white/80 dark:border-white/[0.1] dark:bg-white/[0.05] dark:focus:border-white/20 dark:focus:bg-white/[0.08]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[13px] font-medium text-black/55 dark:text-white/55">
                          Adresse e-mail
                        </label>
                        <div className="flex h-12 items-center rounded-2xl border border-black/[0.06] bg-black/[0.025] px-4 text-[15px] text-black/45 dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white/45">
                          {email}
                        </div>
                        <p className="mt-2 text-[12px] text-black/35 dark:text-white/35">
                          Pour modifier votre e-mail, utilisez la section Sécurité et compte.
                        </p>
                      </div>
                    </div>
                    {profileMessage && (
                      <p className="mt-6 rounded-2xl bg-green-500/10 px-4 py-3 text-[14px] text-green-700 dark:text-green-400">
                        {profileMessage}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="mt-7 h-11 rounded-full bg-black px-6 text-[14px] font-medium text-white transition-all hover:scale-[1.01] disabled:opacity-50 dark:bg-white dark:text-black"
                    >
                      {savingProfile ? "Enregistrement..." : "Enregistrer les modifications"}
                    </button>
                  </form>
                </section>
              )}
              {section === "security" && (
                <div className="space-y-6">
                  <section className="rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
                    <div className="border-b border-black/[0.06] px-7 py-7 dark:border-white/[0.08] sm:px-10">
                      <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                        Compte
                      </p>
                      <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
                        Adresse e-mail
                      </h2>
                    </div>
                    <form onSubmit={handleEmailSubmit} className="px-7 py-8 sm:px-10">
                      <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-black/55 dark:text-white/55">
                        Nouvelle adresse e-mail
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                          id="email"
                          type="email"
                          value={newEmail}
                          onChange={(event) => setNewEmail(event.target.value)}
                          className="h-12 min-w-0 flex-1 rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none transition focus:border-black/20 focus:bg-white/80 dark:border-white/[0.1] dark:bg-white/[0.05] dark:focus:border-white/20 dark:focus:bg-white/[0.08]"
                        />
                        <button
                          type="submit"
                          disabled={savingEmail}
                          className="h-12 shrink-0 rounded-full border border-black/[0.08] bg-white/65 px-6 text-[14px] font-medium transition hover:bg-white/85 disabled:opacity-50 dark:border-white/[0.1] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
                        >
                          {savingEmail ? "Modification..." : "Modifier"}
                        </button>
                      </div>
                      {emailMessage && (
                        <p className="mt-5 rounded-2xl bg-green-500/10 px-4 py-3 text-[14px] text-green-700 dark:text-green-400">
                          {emailMessage}
                        </p>
                      )}
                    </form>
                  </section>
                  <section className="rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
                    <div className="border-b border-black/[0.06] px-7 py-7 dark:border-white/[0.08] sm:px-10">
                      <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                        Sécurité
                      </p>
                      <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
                        Mot de passe
                      </h2>
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="px-7 py-8 sm:px-10">
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="currentPassword" className="mb-2 block text-[13px] font-medium text-black/55 dark:text-white/55">
                            Mot de passe actuel
                          </label>
                          <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            autoComplete="current-password"
                            className="h-12 w-full rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none transition focus:border-black/20 focus:bg-white/80 dark:border-white/[0.1] dark:bg-white/[0.05] dark:focus:border-white/20 dark:focus:bg-white/[0.08]"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="mb-2 block text-[13px] font-medium text-black/55 dark:text-white/55">
                            Nouveau mot de passe
                          </label>
                          <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            autoComplete="new-password"
                            className="h-12 w-full rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none transition focus:border-black/20 focus:bg-white/80 dark:border-white/[0.1] dark:bg-white/[0.05] dark:focus:border-white/20 dark:focus:bg-white/[0.08]"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="mb-2 block text-[13px] font-medium text-black/55 dark:text-white/55">
                            Confirmer le nouveau mot de passe
                          </label>
                          <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            autoComplete="new-password"
                            className="h-12 w-full rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none transition focus:border-black/20 focus:bg-white/80 dark:border-white/[0.1] dark:bg-white/[0.05] dark:focus:border-white/20 dark:focus:bg-white/[0.08]"
                          />
                        </div>
                      </div>
                      {passwordMessage && (
                        <p className="mt-6 rounded-2xl bg-green-500/10 px-4 py-3 text-[14px] text-green-700 dark:text-green-400">
                          {passwordMessage}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="mt-7 h-11 rounded-full bg-black px-6 text-[14px] font-medium text-white transition-all hover:scale-[1.01] disabled:opacity-50 dark:bg-white dark:text-black"
                      >
                        {savingPassword ? "Modification..." : "Modifier le mot de passe"}
                      </button>
                    </form>
                  </section>
                </div>
              )}
              {section === "preferences" && (
                <section className="rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
                  <div className="border-b border-black/[0.06] px-7 py-7 dark:border-white/[0.08] sm:px-10">
                    <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                      FindMovie
                    </p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
                      Préférences
                    </h2>
                    <p className="mt-2 text-[14px] leading-6 text-black/40 dark:text-white/40">
                      Personnalisez directement les critères utilisés pour vos recommandations.
                    </p>
                  </div>
                  <form onSubmit={handlePreferencesSubmit} className="px-7 py-8 sm:px-10">
                    <div>
                      <p className="text-[15px] font-medium">
                        Plateformes que vous utilisez
                      </p>
                      <p className="mt-2 text-[13px] leading-6 text-black/40 dark:text-white/40">
                        Sélectionnez toutes les plateformes auxquelles vous avez accès.
                      </p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {streamingServices.map((service) => {
                          const selected = preferences.streaming_services.includes(service);
                          return (
                            <button
                              key={service}
                              type="button"
                              onClick={() => toggleStreamingService(service)}
                              className={`flex min-h-[54px] items-center justify-between rounded-[18px] border px-4 text-left text-[14px] font-medium transition-all ${
                                selected
                                  ? "border-black/[0.12] bg-black/[0.08] text-black shadow-sm dark:border-white/[0.16] dark:bg-white/[0.1] dark:text-white"
                                  : "border-black/[0.06] bg-white/50 text-black/55 hover:bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/55 dark:hover:bg-white/[0.08]"
                              }`}
                            >
                              <span>{service}</span>
                              <span className={`text-[16px] ${selected ? "opacity-100" : "opacity-25"}`}>
                                {selected ? "✓" : "○"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-10">
                      <p className="text-[15px] font-medium">
                        Genres préférés
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {genres.map((genre) => {
                          const selected = preferences.genres.includes(genre);
                          return (
                            <button
                              key={genre}
                              type="button"
                              onClick={() => toggleGenre(genre)}
                              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                                selected
                                  ? "border-black/[0.12] bg-black/[0.08] text-black dark:border-white/[0.16] dark:bg-white/[0.1] dark:text-white"
                                  : "border-black/[0.06] bg-white/50 text-black/50 hover:bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/50 dark:hover:bg-white/[0.08]"
                              }`}
                            >
                              {genre}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-10">
                      <label htmlFor="mood" className="mb-3 block text-[15px] font-medium">
                        Humeur
                      </label>
                      <select
                        id="mood"
                        value={preferences.mood || ""}
                        onChange={(event) =>
                          setPreferences((current) => ({
                            ...current,
                            mood: event.target.value || null,
                          }))
                        }
                        className="h-12 w-full appearance-none rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none dark:border-white/[0.1] dark:bg-white/[0.05]"
                      >
                        <option value="">Choisir une humeur</option>
                        {moods.map((mood) => (
                          <option key={mood.value} value={mood.value}>
                            {mood.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-8">
                      <label htmlFor="energy" className="mb-3 block text-[15px] font-medium">
                        Ambiance
                      </label>
                      <select
                        id="energy"
                        value={preferences.energy || ""}
                        onChange={(event) =>
                          setPreferences((current) => ({
                            ...current,
                            energy: event.target.value || null,
                          }))
                        }
                        className="h-12 w-full appearance-none rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none dark:border-white/[0.1] dark:bg-white/[0.05]"
                      >
                        <option value="">Choisir une ambiance</option>
                        {energies.map((energy) => (
                          <option key={energy.value} value={energy.value}>
                            {energy.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-8">
                      <label htmlFor="duration" className="mb-3 block text-[15px] font-medium">
                        Durée
                      </label>
                      <select
                        id="duration"
                        value={preferences.duration || ""}
                        onChange={(event) =>
                          setPreferences((current) => ({
                            ...current,
                            duration: event.target.value || null,
                          }))
                        }
                        className="h-12 w-full appearance-none rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none dark:border-white/[0.1] dark:bg-white/[0.05]"
                      >
                        <option value="">Choisir une durée</option>
                        {durations.map((duration) => (
                          <option key={duration.value} value={duration.value}>
                            {duration.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-8">
                      <label htmlFor="discovery" className="mb-3 block text-[15px] font-medium">
                        Découverte
                      </label>
                      <select
                        id="discovery"
                        value={preferences.discovery || ""}
                        onChange={(event) =>
                          setPreferences((current) => ({
                            ...current,
                            discovery: event.target.value || null,
                          }))
                        }
                        className="h-12 w-full appearance-none rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none dark:border-white/[0.1] dark:bg-white/[0.05]"
                      >
                        <option value="">Choisir</option>
                        {discoveries.map((discovery) => (
                          <option key={discovery.value} value={discovery.value}>
                            {discovery.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-8">
                      <label htmlFor="maxAge" className="mb-3 block text-[15px] font-medium">
                        Limite d'âge
                      </label>
                      <select
                        id="maxAge"
                        value={preferences.max_age || ""}
                        onChange={(event) =>
                          setPreferences((current) => ({
                            ...current,
                            max_age: event.target.value || null,
                          }))
                        }
                        className="h-12 w-full appearance-none rounded-2xl border border-black/[0.08] bg-white/60 px-4 text-[15px] outline-none dark:border-white/[0.1] dark:bg-white/[0.05]"
                      >
                        <option value="">Aucune limite</option>
                        {maxAges.map((age) => (
                          <option key={age.value} value={age.value}>
                            {age.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-10">
                      <div className="flex items-center justify-between gap-5">
                        <div>
                          <p className="text-[15px] font-medium">
                            Contenu adulte
                          </p>
                          <p className="mt-1 text-[13px] leading-5 text-black/40 dark:text-white/40">
                            Autoriser l'affichage de contenu destiné aux adultes.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={preferences.allow_adult}
                          onClick={() =>
                            setPreferences((current) => ({
                              ...current,
                              allow_adult: !current.allow_adult,
                            }))
                          }
                          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                            preferences.allow_adult
                              ? "bg-black dark:bg-white"
                              : "bg-black/[0.12] dark:bg-white/[0.18]"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-transform ${
                              preferences.allow_adult
                                ? "translate-x-6 dark:bg-black"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    {!preferences.allow_adult && (
                      <p className="mt-4 rounded-2xl bg-green-500/10 px-4 py-3 text-[13px] leading-5 text-green-700 dark:text-green-400">
                        Le contenu adulte est bloqué dans FindMovie.
                      </p>
                    )}
                    {preferencesMessage && (
                      <p className="mt-6 rounded-2xl bg-green-500/10 px-4 py-3 text-[14px] text-green-700 dark:text-green-400">
                        {preferencesMessage}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={savingPreferences}
                      className="mt-8 h-11 rounded-full bg-black px-6 text-[14px] font-medium text-white transition-all hover:scale-[1.01] disabled:opacity-50 dark:bg-white dark:text-black"
                    >
                      {savingPreferences ? "Enregistrement..." : "Enregistrer les préférences"}
                    </button>
                  </form>
                </section>
              )}
              {section === "appearance" && (
                <section className="rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
                  <div className="border-b border-black/[0.06] px-7 py-7 dark:border-white/[0.08] sm:px-10">
                    <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                      Application
                    </p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
                      Apparence
                    </h2>
                    <p className="mt-2 text-[14px] leading-6 text-black/40 dark:text-white/40">
                      Choisissez l'apparence de FindMovie.
                    </p>
                  </div>
                  <div className="grid gap-4 px-7 py-8 sm:grid-cols-3 sm:px-10">
                    <button type="button" className="rounded-[24px] border border-black/[0.1] bg-white p-5 text-left shadow-sm dark:border-white/[0.12]">
                      <div className="h-20 rounded-[16px] border border-black/[0.08] bg-[#f5f5f7] p-3">
                        <div className="h-2 w-12 rounded-full bg-black/10" />
                        <div className="mt-3 h-8 rounded-xl bg-white shadow-sm" />
                      </div>
                      <p className="mt-4 text-[14px] font-medium">Clair</p>
                    </button>
                    <button type="button" className="rounded-[24px] border border-black/[0.1] bg-white p-5 text-left shadow-sm dark:border-white/[0.12]">
                      <div className="h-20 rounded-[16px] border border-white/[0.1] bg-[#050505] p-3">
                        <div className="h-2 w-12 rounded-full bg-white/15" />
                        <div className="mt-3 h-8 rounded-xl bg-white/[0.08]" />
                      </div>
                      <p className="mt-4 text-[14px] font-medium">Sombre</p>
                    </button>
                    <button type="button" className="rounded-[24px] border border-black/[0.08] bg-white/50 p-5 text-left shadow-sm dark:border-white/[0.1] dark:bg-white/[0.05]">
                      <div className="h-20 rounded-[16px] bg-gradient-to-br from-[#f5f5f7] to-[#080808] p-3">
                        <div className="h-2 w-12 rounded-full bg-black/20 dark:bg-white/20" />
                        <div className="mt-3 h-8 rounded-xl bg-white/40 dark:bg-black/30" />
                      </div>
                      <p className="mt-4 text-[14px] font-medium">Système</p>
                    </button>
                  </div>
                  <p className="px-7 pb-8 text-[13px] text-black/35 dark:text-white/35 sm:px-10">
                    La sélection de l'apparence sera connectée au système de thème de FindMovie.
                  </p>
                </section>
              )}
              {section === "language" && (
                <section className="rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
                  <div className="border-b border-black/[0.06] px-7 py-7 dark:border-white/[0.08] sm:px-10">
                    <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                      Application
                    </p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
                      Langue
                    </h2>
                    <p className="mt-2 text-[14px] leading-6 text-black/40 dark:text-white/40">
                      Choisissez la langue utilisée par FindMovie.
                    </p>
                  </div>
                  <div className="space-y-2 px-7 py-8 sm:px-10">
                    <button type="button" className="flex w-full items-center justify-between rounded-[20px] border border-black/[0.08] bg-black/[0.05] px-5 py-4 text-left dark:border-white/[0.12] dark:bg-white/[0.08]">
                      <span className="text-[15px] font-medium">Français</span>
                      <span className="text-[13px] text-black/40 dark:text-white/40">FR</span>
                    </button>
                    <button type="button" className="flex w-full items-center justify-between rounded-[20px] border border-black/[0.06] bg-white/40 px-5 py-4 text-left transition hover:bg-white/70 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.07]">
                      <span className="text-[15px] font-medium">English</span>
                      <span className="text-[13px] text-black/40 dark:text-white/40">EN</span>
                    </button>
                    <button type="button" className="flex w-full items-center justify-between rounded-[20px] border border-black/[0.06] bg-white/40 px-5 py-4 text-left transition hover:bg-white/70 dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.07]">
                      <span className="text-[15px] font-medium">Español</span>
                      <span className="text-[13px] text-black/40 dark:text-white/40">ES</span>
                    </button>
                  </div>
                </section>
              )}
              {section === "privacy" && (
                <section className="rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
                  <div className="border-b border-black/[0.06] px-7 py-7 dark:border-white/[0.08] sm:px-10">
                    <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                      Données
                    </p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
                      Confidentialité
                    </h2>
                  </div>
                  <div className="divide-y divide-black/[0.06] px-7 py-2 dark:divide-white/[0.08] sm:px-10">
                    <div className="py-6">
                      <p className="text-[16px] font-medium">
                        Personnalisation
                      </p>
                      <p className="mt-2 text-[14px] leading-6 text-black/40 dark:text-white/40">
                        FindMovie utilise vos préférences, films vus, exclusions et évaluations pour améliorer vos recommandations.
                      </p>
                    </div>
                    <div className="py-6">
                      <p className="text-[16px] font-medium">
                        Vos données vous appartiennent
                      </p>
                      <p className="mt-2 text-[14px] leading-6 text-black/40 dark:text-white/40">
                        Vous pourrez gérer, exporter ou supprimer vos données personnelles depuis cette section.
                      </p>
                    </div>
                  </div>
                </section>
              )}
              {section === "data" && (
                <section className="rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
                  <div className="border-b border-black/[0.06] px-7 py-7 dark:border-white/[0.08] sm:px-10">
                    <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                      Données
                    </p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">
                      Mes données
                    </h2>
                    <p className="mt-2 text-[14px] leading-6 text-black/40 dark:text-white/40">
                      Gérez les différentes données associées à votre compte.
                    </p>
                  </div>
                  <div className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
                    <Link href="/favorites" className="group flex items-center justify-between gap-6 px-7 py-6 sm:px-10">
                      <div>
                        <p className="text-[16px] font-medium">Favoris</p>
                        <p className="mt-1 text-[14px] text-black/40 dark:text-white/40">
                          Consultez les films enregistrés.
                        </p>
                      </div>
                      <span className="text-[20px] text-black/25 transition-transform group-hover:translate-x-1 dark:text-white/25">→</span>
                    </Link>
                    <Link href="/watched" className="group flex items-center justify-between gap-6 px-7 py-6 sm:px-10">
                      <div>
                        <p className="text-[16px] font-medium">Films vus</p>
                        <p className="mt-1 text-[14px] text-black/40 dark:text-white/40">
                          Consultez votre historique.
                        </p>
                      </div>
                      <span className="text-[20px] text-black/25 transition-transform group-hover:translate-x-1 dark:text-white/25">→</span>
                    </Link>
                    <div className="px-7 py-6 sm:px-10">
                      <p className="text-[16px] font-medium">Exporter mes données</p>
                      <p className="mt-1 text-[14px] text-black/40 dark:text-white/40">
                        Cette fonctionnalité pourra générer une copie de vos données FindMovie.
                      </p>
                      <button type="button" disabled className="mt-4 h-10 rounded-full border border-black/[0.08] bg-white/50 px-5 text-[13px] font-medium text-black/35 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-white/35">
                        Bientôt disponible
                      </button>
                    </div>
                  </div>
                </section>
              )}
              <div className="mt-8 lg:hidden">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-[24px] border border-black/[0.06] bg-white/55 px-5 py-4 text-center text-[14px] font-medium text-black/55 shadow-[0_15px_50px_rgba(0,0,0,0.03)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055] dark:text-white/55"
                >
                  {loggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
              </div>
              <div className="mt-8 rounded-[28px] border border-red-500/[0.12] bg-red-500/[0.025] p-6 dark:border-red-400/[0.12] dark:bg-red-400/[0.025]">
                <p className="text-[13px] font-medium text-red-600/60 dark:text-red-400/60">
                  Zone sensible
                </p>
                <h3 className="mt-2 text-[19px] font-semibold">
                  Supprimer mon compte
                </h3>
                <p className="mt-2 max-w-2xl text-[14px] leading-6 text-black/40 dark:text-white/40">
                  La suppression du compte supprimera définitivement vos informations personnelles, préférences, favoris, films vus, exclusions et évaluations.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="mt-5 h-11 rounded-full border border-red-500/[0.15] bg-red-500/[0.06] px-6 text-[14px] font-medium text-red-600 transition hover:bg-red-500/[0.1] dark:border-red-400/[0.15] dark:bg-red-400/[0.06] dark:text-red-400 dark:hover:bg-red-400/[0.1]"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}