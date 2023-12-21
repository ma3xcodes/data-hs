const locale = ":lng";

module.exports = {
  SIDEBAR_NAV: [
    {
      title: "Explore.Title", url: `/${locale}/explore`, items: [
        {title: "Cities & Places", url: `/${locale}/explore?profile=geo`},
        {title: "Products", url: `/${locale}/explore?profile=product`},
        {title: "Industries", url: `/${locale}/explore?profile=industry`},
        {title: "Countries", url: `/${locale}/explore?profile=country`},
        {title: "Occupations", url: `/${locale}/explore?profile=occupation`},
        {title: "Universities", url: `/${locale}/explore?profile=institution`}
      ]
    },
    //  {title: "Coronavirus", url: `/${locale}/coronavirus`},
    {title: "ECI Explorer.Title", url: `/${locale}/profile/economic_complexity/1`},
    {title: "Vizbuilder.Title", url: `/${locale}/vizbuilder`},
    {title: "About.Background", url: `/${locale}/about`}
    // {title: "Data Cart",          url: `/${locale}/cart`},
    // {title: "Data sources",       url: `/${locale}/data`}
  ],
  FOOTER_GOB_NAV: [
    {
      title: "Footer.Titles.Links", items: [
        {title: "Footer.Gob.Publications", url: "https://www.gob.mx/publicaciones"},
        {title: "Footer.Gob.Transparency", url: "https://consultapublicamx.inai.org.mx/vut-web/faces/view/consultaPublica.xhtml#inicio"},
        {title: "Footer.Gob.INAI", url: "https://home.inai.org.mx/"},
        {title: "Footer.Gob.Complaint", url: "https://alertadores.funcionpublica.gob.mx"},
        {title: "Footer.Gob.National Transparency Platform", url: "https://www.infomex.org.mx/gobiernofederal/home.action"}
      ]
    },
    {
      title: "Footer.Titles.What is",
      desc: "Footer.Gob.Description",
      items: [
        {title: "Footer.Gob.Open Data Plaftorm", url: "https://datos.gob.mx/"},
        {title: "Footer.Gob.Accessibility Statement", url: "https://www.gob.mx/accesibilidad"},
        {title: "Footer.Gob.Comprehensive privacy notice", url: "https://www.gob.mx/aviso_de_privacidad"},
        {title: "Footer.Gob.Simplified privacy notice", url: "https://www.gob.mx/privacidadsimplificado"},
        {title: "Footer.Gob.Terms and Conditions", url: "https://www.gob.mx/terminos"},
        {title: "Footer.Gob.Security policy", url: "https://www.gob.mx/terminos#medidas-seguridad-informacion"},
        {title: "Footer.Gob.Site Map", url: "https://www.gob.mx/sitemap"}
      ]
    }
  ],
  FOOTER_NAV: [
    {title: "Footer.Titles.Explorer", url: `/${locale}/explore`},
    {title: "Footer.Titles.ECI Explorer", url: `/${locale}/profile/economic_complexity/1`},
    {title: "Footer.Titles.Vizbuilder", url: `/${locale}/vizbuilder`},
    {title: "Footer.Titles.About", url: `/${locale}/about`}
  ],
  GOB_SOCIAL_MEDIA: [
    {
      title: "Facebook",
      url: "https://www.facebook.com/SE.Economia",
      src: "facebook-white.svg"
    },
    {
      title: "Twitter",
      url: "https://twitter.com/SE_mx",
      src: "twitter-white.svg"
    }
  ],
  LOGOS: [
    {
      title: "Secretaría de Economía",
      url: "https://www.gob.mx/se/",
      src: "SE.png"
    }
    // {
    //   title: "Mexicans and Americans Thinking Together",
    //   url: "https://www.facebook.com/MexicansAndAmericansThinkingTogether",
    //   src: "matt-white.svg"
    // },
    /*   {
      title: "Datawheel",
      url: "https://www.datawheel.us/",
      src: "datawheel-white.svg"
    }*/
  ],
  LOGOS_FOOTER: [
    {
      title: "Secretaría de Economía",
      url: "https://www.gob.mx/se/",
      src: "SE.png"
    },
    {
      title: "Datawheel",
      url: "https://www.datawheel.us/",
      src: "datawheel-white.svg"
    }
  ],
  SOCIAL_MEDIA: [
    {
      title: "Facebook",
      url: "https://www.facebook.com/DataM%C3%A9xico-115429396917605/",
      src: "facebook-green.svg"
    },
    {
      title: "Twitter",
      url: "https://twitter.com/DataMexico_",
      src: "twitter-green.svg"
    },
    {
      title: "Instagram",
      url: "https://www.instagram.com/se.datamexico/",
      src: "instagram-green.svg"
    },
    {
      title: "YouTube",
      url: "https://www.youtube.com/channel/UCsNIaF3LijPsSiILPq_H6kw",
      src: "youtube-green.svg"
    }
  ],
  HOME_NAV: [
    {
      icon: "/icons/homepage/svg/explore-profiles-icon.svg",
      link: "explore",
      title: "Profiles",
      text: "Homepage.ProfileText"
    },

    /*  {
      icon: "/icons/homepage/svg/coronavirus-icon.svg",
      link: "coronavirus",
      title: "Coronavirus",
      text: "Homepage.CoronavirusText"
    },*/
    {
      icon: "/icons/homepage/svg/complejidad-economica-icon.svg",
      link: "profile/economic_complexity/1",
      title: "Complexity",
      text: "Homepage.ComplexityText"
    },
    {
      icon: "/icons/homepage/svg/productos-white-icon.svg",
      link: "vizbuilder",
      title: "VizBuilder",
      text: "Homepage.VizBuilderText"
    }
  ],
  HOME_GOB_LINKS: [
    {
      name: "Homepage.Procedures",
      desc: "Homepage.Consultation by procedure category",
      links: [
        {
          name: "Homepage.Communications and transportation",
          link: "https://www.gob.mx/tramites/comunicaciones"
        },
        {
          name: "Homepage.Economy",
          link: "https://www.gob.mx/tramites/economia"
        },
        {
          name: "Homepage.Education",
          link: "https://www.gob.mx/tramites/educacion"
        },
        {
          name: "Homepage.Energy",
          link: "https://www.gob.mx/tramites/energia"
        },
        {
          name: "Homepage.Identity, passport and migration",
          link: "https://www.gob.mx/tramites/identidad"
        },
        {
          name: "Homepage.Taxes and contributions",
          link: "https://www.gob.mx/tramites/impuestos"
        },
        {
          name: "Homepage.Environment",
          link: "https://www.gob.mx/tramites/ambiente"
        },
        {
          name: "Homepage.Social programs",
          link: "https://www.gob.mx/tramites/programas"
        },
        {
          name: "Homepage.Health",
          link: "https://www.gob.mx/tramites/salud"
        },
        {
          name: "Homepage.Security, legality and justice",
          link: "https://www.gob.mx/tramites/seguridad"
        },
        {
          name: "Homepage.Financial services",
          link: "https://www.gob.mx/tramites/financieros"
        },
        {
          name: "Homepage.Territory and housing",
          link: "https://www.gob.mx/tramites/territorio"
        },
        {
          name: "Homepage.Work",
          link: "https://www.gob.mx/tramites/trabajo"
        },
        {
          name: "Homepage.Tourism",
          link: "https://www.gob.mx/tramites/turismo"
        },
        {
          name: "Homepage.Others",
          link: "https://www.gob.mx/tramites/otros"
        }
      ]
    },
    {
      name: "Homepage.Government",
      desc: "Homepage.Institutions of the Government of Mexico",
      links: [
        {
          name: "Homepage.Agriculture",
          link: "https://www.gob.mx/agricultura"
        },
        {
          name: "Homepage.Wellness",
          link: "https://www.gob.mx/bienestar"
        },
        {
          name: "Homepage.Communications and transportation",
          link: "https://www.gob.mx/sct"
        },
        {
          name: "Homepage.Culture",
          link: "https://www.gob.mx/cultura"
        },
        {
          name: "Homepage.National defense",
          link: "https://www.gob.mx/sedena"
        },
        {
          name: "Homepage.Agrarian development",
          link: "https://www.gob.mx/sedatu"
        },
        {
          name: "Homepage.Economy",
          link: "https://www.gob.mx/se"
        },
        {
          name: "Homepage.Public education",
          link: "https://www.gob.mx/sep"
        },
        {
          name: "Homepage.Energy",
          link: "https://www.gob.mx/sener"
        },
        {
          name: "Homepage.Public function",
          link: "https://www.gob.mx/sfp"
        },
        {
          name: "Homepage.Governorate",
          link: "https://www.gob.mx/segob"
        },
        {
          name: "Homepage.Treasury",
          link: "https://www.gob.mx/shcp"
        },
        {
          name: "Homepage.Marine",
          link: "https://www.gob.mx/semar"
        },
        {
          name: "Homepage.Environment",
          link: "https://www.gob.mx/semarnat"
        },
        {
          name: "Homepage.Presidency",
          link: "https://www.gob.mx/presidencia"
        },
        {
          name: "Homepage.External relationships",
          link: "https://www.gob.mx/sre"
        },
        {
          name: "Homepage.Health",
          link: "https://www.gob.mx/salud"
        },
        {
          name: "Homepage.Work",
          link: "https://www.gob.mx/stps"
        },
        {
          name: "Homepage.Tourism",
          link: "https://www.gob.mx/sectur"
        }
      ]
    }
  ]
};
