export type WeddingConfig = {
  brideName: string
  groomName: string
  weddingDate: string
  timezone: string
  weddingStartTime: string
  weddingEndTime: string
  programme: Array<{
    title: string
    time: string
  }>
  rsvp: {
    contacts: Array<string | {
      name: string
      phone?: string
      whatsapp?: string
    }>
  }
  monogram: string
  couplePhotoUrl: string
  family: {
    groomFather: string
    groomMother: string
    brideFather: string
    brideMother: string
    closingLine: string
  }
  invitationMessage: string
  venue: {
    name: string
    address: string
    city: string
    googleMapsUrl: string
    photoUrl: string
  }
  galleryImages: Array<{
    src: string
    alt: string
    caption: string
  }>
  backgroundMusic: {
    src: string
    title: string
  }
}

export const weddingConfig: WeddingConfig = {
  brideName: 'Alisha Fatima',
  groomName: 'Mohd. Owais Syed',
  weddingDate: '2026-12-16',
  timezone: 'Asia/Kolkata',
  weddingStartTime: '11:00 AM',
  weddingEndTime: '05:00 PM',
  programme: [
    { title: 'Lunch', time: '11:00 AM to 1:00 PM' },
    { title: 'Nikah', time: '01:30 PM' },
    { title: 'Rukhsati', time: '05:00 PM' },
  ],
  rsvp: {
    contacts: [
      'Qazi Israr',
      'Qazi Javed Ahmed',
      'Dr. Parvez Ahmad',
      'Qazi Gulrez Ahmad',
      'Qazi Rafi',
      'Dr. Farhan Naiyer',
      'Dr. Mohd. Humzah(MD)',
      'Mohd Ali Raza',
      'Arsalan',
      'Alham',
      'Injaman',
      'Ehtesham',
      'All Relatives & Friends',
    ],
  },
  monogram: '',
  couplePhotoUrl: '',
  family: {
    groomFather: 'Syed Zubair Ahmed',
    groomMother: '',
    brideFather: 'Dr. Zubair Ahmed',
    brideMother: '',
    closingLine: 'With love and blessings',
  },
  invitationMessage: '',
  venue: {
    name: 'Welcome Marriage Hall',
    address: 'Welcome Marriage Hall, Bayara Chauraha, Utraula Road, Chakchayi, Siddharth Nagar, Uttar Pradesh 272192',
    city: 'Lucknow, Uttar Pradesh',
    googleMapsUrl: 'https://www.google.com/maps/dir//Welcome+Marriage+Hall+Chakchai,+5H4X%2BW8G,+Bayara+Chauraha+Rd,+Dhankharpur,+Uttar+Pradesh+272191/@19.120128,72.8858624,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3997370d7df335b7:0xf466d180bc95002!2m2!1d82.5983157!2d27.1573041?entry=ttu&g_ep=EgoyMDI2MTEyMi4wIKXMDSoASAFQAw%3D%3D',
    photoUrl: '',
  },
  galleryImages: [],
  backgroundMusic: {
    src: '',
    title: '',
  },
}
