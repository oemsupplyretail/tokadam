export const site = {
  companyName: "PADOX PRO",
  productName: "PADOX PRO",
  metadata: {
    title: "PADOX PRO | Rahsia Tahan 45 Minit",
    description: "PADOX PRO — formulasi khusus untuk lelaki.",
  },
  phone: "+60 11-5771 4468",
  email: "hello@sprayup.my",
  whatsapp: {
    number: "601157714468",
    prefilledMessage: "Hai, saya berminat dengan *PADOX PRO*. Boleh saya dapatkan maklumat lanjut?",
    get url() {
      return `https://wa.me/${this.number}?text=${encodeURIComponent(this.prefilledMessage)}`;
    },
    ariaLabel: "Hubungi kami di WhatsApp",
  },
  socialLinks: {
    facebook: "",
    instagram: "",
    tiktok: "",
  },
  links: {
    packagesAnchor: "#pakej",
    tutorialVideo: "https://www.youtube-nocookie.com/embed/11jfM7Xp81E?controls=0&rel=0&modestbranding=1&playsinline=1",
  },
} as const;
