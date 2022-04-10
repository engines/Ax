// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax, dependencies={}) => factory(ax, dependencies)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax, dependencies={}) {

const a = ax.a,
  x = ax.x,
  is = ax.is;

ax.extensions.lib.locale = {};

ax.extensions.form.field.extras = {};

ax.extensions.lib.locale.countries = {
  AF: 'Afghanistan',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AQ: 'Antarctica',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'Congo, The Democratic Republic of The',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  CI: "CÔte D'ivoire",
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (Malvinas)',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GN: 'Guinea',
  GW: 'Guinea Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island and Mcdonald Islands',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran, Islamic Republic of',
  IQ: 'Iraq',
  IE: 'Ireland',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: "Korea, Democratic People's Republic of",
  KR: 'Korea, Republic of',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: "Lao People's Democratic Republic",
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libyan Arab Jamahiriya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MK: 'Macedonia, The Former Yugoslav Republic of',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia, Federated States of',
  MD: 'Monaco',
  MN: 'Mongolia',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  AN: 'Netherlands Antilles',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestinian Territory, Occupied',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  RE: 'RÉunion',
  RO: 'Romania',
  RU: 'Russian Federation',
  RW: 'Rwanda',
  SH: 'Saint Helena',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  PM: 'Saint Pierre and Miquelon',
  VC: 'Saint Vincent and The Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  CS: 'Serbia and Montenegro',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia and The South Sandwich Islands',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard and Jan Mayen',
  SZ: 'Swaziland',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan, Province of China',
  TJ: 'Tajikistan',
  TZ: 'Tanzania, United Republic of',
  TH: 'Thailand',
  TL: 'Timor Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks and Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UM: 'United States Minor Outlying Islands',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela',
  VN: 'Viet Nam',
  VG: 'Virgin Islands, British',
  VI: 'Virgin Islands, U.S.',
  WF: 'Wallis and Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
};

ax.extensions.lib.locale.languages = {
  ach: 'Acholi',
  aa: 'Afar',
  af: 'Afrikaans',
  ak: 'Akan',
  tw: 'Akan, Twi',
  sq: 'Albanian',
  am: 'Amharic',
  ar: 'Arabic',
  'ar-BH': 'Arabic, Bahrain',
  'ar-EG': 'Arabic, Egypt',
  'ar-SA': 'Arabic, Saudi Arabia',
  'ar-YE': 'Arabic, Yemen',
  an: 'Aragonese',
  'hy-AM': 'Armenian',
  frp: 'Arpitan',
  as: 'Assamese',
  ast: 'Asturian',
  tay: 'Atayal',
  av: 'Avaric',
  ae: 'Avestan',
  ay: 'Aymara',
  az: 'Azerbaijani',
  ban: 'Balinese',
  bal: 'Balochi',
  bm: 'Bambara',
  ba: 'Bashkir',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali',
  'bn-IN': 'Bengali, India',
  ber: 'Berber',
  bh: 'Bihari',
  bfo: 'Birifor',
  bi: 'Bislama',
  bs: 'Bosnian',
  'br-FR': 'Breton',
  bg: 'Bulgarian',
  my: 'Burmese',
  ca: 'Catalan',
  ceb: 'Cebuano',
  ch: 'Chamorro',
  ce: 'Chechen',
  chr: 'Cherokee',
  ny: 'Chewa',
  'zh-CN': 'Chinese Simplified',
  'zh-TW': 'Chinese Traditional',
  'zh-HK': 'Chinese Traditional, Hong Kong',
  'zh-MO': 'Chinese Traditional, Macau',
  'zh-SG': 'Chinese Traditional, Singapore',
  cv: 'Chuvash',
  kw: 'Cornish',
  co: 'Corsican',
  cr: 'Cree',
  hr: 'Croatian',
  cs: 'Czech',
  da: 'Danish',
  'fa-AF': 'Dari',
  dv: 'Dhivehi',
  nl: 'Dutch',
  'nl-BE': 'Dutch, Belgium',
  'nl-SR': 'Dutch, Suriname',
  dz: 'Dzongkha',
  en: 'English',
  'en-AR': 'English, Arabia',
  'en-AU': 'English, Australia',
  'en-BZ': 'English, Belize',
  'en-CA': 'English, Canada',
  'en-CB': 'English, Caribbean',
  'en-CN': 'English, China',
  'en-DK': 'English, Denmark',
  'en-HK': 'English, Hong Kong',
  'en-IN': 'English, India',
  'en-ID': 'English, Indonesia',
  'en-IE': 'English, Ireland',
  'en-JM': 'English, Jamaica',
  'en-JA': 'English, Japan',
  'en-MY': 'English, Malaysia',
  'en-NZ': 'English, New Zealand',
  'en-NO': 'English, Norway',
  'en-PH': 'English, Philippines',
  'en-PR': 'English, Puerto Rico',
  'en-SG': 'English, Singapore',
  'en-ZA': 'English, South Africa',
  'en-SE': 'English, Sweden',
  'en-GB': 'English, United Kingdom',
  'en-US': 'English, United States',
  'en-ZW': 'English, Zimbabwe',
  eo: 'Esperanto',
  et: 'Estonian',
  ee: 'Ewe',
  fo: 'Faroese',
  fj: 'Fijian',
  fil: 'Filipino',
  fi: 'Finnish',
  'vls-BE': 'Flemish',
  'fra-DE': 'Franconian',
  fr: 'French',
  'fr-BE': 'French, Belgium',
  'fr-CA': 'French, Canada',
  'fr-LU': 'French, Luxembourg',
  'fr-QC': 'French, Quebec',
  'fr-CH': 'French, Switzerland',
  'fy-NL': 'Frisian',
  'fur-IT': 'Friulian',
  ff: 'Fula',
  gaa: 'Ga',
  gl: 'Galician',
  ka: 'Georgian',
  de: 'German',
  'de-AT': 'German, Austria',
  'de-BE': 'German, Belgium',
  'de-LI': 'German, Liechtenstein',
  'de-LU': 'German, Luxembourg',
  'de-CH': 'German, Switzerland',
  got: 'Gothic',
  el: 'Greek',
  'el-CY': 'Greek, Cyprus',
  kl: 'Greenlandic',
  gn: 'Guarani',
  'gu-IN': 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  haw: 'Hawaiian',
  he: 'Hebrew',
  hz: 'Herero',
  hil: 'Hiligaynon',
  hi: 'Hindi',
  ho: 'Hiri Motu',
  hmn: 'Hmong',
  hu: 'Hungarian',
  is: 'Icelandic',
  ido: 'Ido',
  ig: 'Igbo',
  ilo: 'Ilokano',
  id: 'Indonesian',
  iu: 'Inuktitut',
  'ga-IE': 'Irish',
  it: 'Italian',
  'it-CH': 'Italian, Switzerland',
  ja: 'Japanese',
  jv: 'Javanese',
  quc: "K'iche'",
  kab: 'Kabyle',
  kn: 'Kannada',
  pam: 'Kapampangan',
  ks: 'Kashmiri',
  'ks-PK': 'Kashmiri, Pakistan',
  csb: 'Kashubian',
  kk: 'Kazakh',
  km: 'Khmer',
  rw: 'Kinyarwanda',
  'tlh-AA': 'Klingon',
  kv: 'Komi',
  kg: 'Kongo',
  kok: 'Konkani',
  ko: 'Korean',
  ku: 'Kurdish',
  kmr: 'Kurmanji (Kurdish)',
  kj: 'Kwanyama',
  ky: 'Kyrgyz',
  lol: 'LOLCAT',
  lo: 'Lao',
  'la-LA': 'Latin',
  lv: 'Latvian',
  lij: 'Ligurian',
  li: 'Limburgish',
  ln: 'Lingala',
  lt: 'Lithuanian',
  jbo: 'Lojban',
  nds: 'Low German',
  'dsb-DE': 'Lower Sorbian',
  lg: 'Luganda',
  luy: 'Luhya',
  lb: 'Luxembourgish',
  mk: 'Macedonian',
  mai: 'Maithili',
  mg: 'Malagasy',
  ms: 'Malay',
  'ms-BN': 'Malay, Brunei',
  'ml-IN': 'Malayalam',
  mt: 'Maltese',
  gv: 'Manx',
  mi: 'Maori',
  arn: 'Mapudungun',
  mr: 'Marathi',
  mh: 'Marshallese',
  moh: 'Mohawk',
  mn: 'Mongolian',
  'sr-Cyrl-ME': 'Montenegrin (Cyrillic)',
  me: 'Montenegrin (Latin)',
  mos: 'Mossi',
  na: 'Nauru',
  ng: 'Ndonga',
  'ne-NP': 'Nepali',
  'ne-IN': 'Nepali, India',
  pcm: 'Nigerian Pidgin',
  se: 'Northern Sami',
  nso: 'Northern Sotho',
  no: 'Norwegian',
  nb: 'Norwegian Bokmal',
  'nn-NO': 'Norwegian Nynorsk',
  oc: 'Occitan',
  oj: 'Ojibwe',
  or: 'Oriya',
  om: 'Oromo',
  os: 'Ossetian',
  pi: 'Pali',
  pap: 'Papiamento',
  ps: 'Pashto',
  fa: 'Persian',
  'en-PT': 'Pirate English',
  pl: 'Polish',
  'pt-PT': 'Portuguese',
  'pt-BR': 'Portuguese, Brazilian',
  'pa-IN': 'Punjabi',
  'pa-PK': 'Punjabi, Pakistan',
  qu: 'Quechua',
  'qya-AA': 'Quenya',
  ro: 'Romanian',
  'rm-CH': 'Romansh',
  rn: 'Rundi',
  ru: 'Russian',
  'ru-BY': 'Russian, Belarus',
  'ru-MD': 'Russian, Moldova',
  'ru-UA': 'Russian, Ukraine',
  'ry-UA': 'Rusyn',
  sah: 'Sakha',
  sg: 'Sango',
  sa: 'Sanskrit',
  sat: 'Santali',
  sc: 'Sardinian',
  sco: 'Scots',
  gd: 'Scottish Gaelic',
  sr: 'Serbian (Cyrillic)',
  'sr-CS': 'Serbian (Latin)',
  sh: 'Serbo-Croatian',
  crs: 'Seychellois Creole',
  sn: 'Shona',
  ii: 'Sichuan Yi',
  sd: 'Sindhi',
  'si-LK': 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  son: 'Songhay',
  ckb: 'Sorani (Kurdish)',
  nr: 'Southern Ndebele',
  sma: 'Southern Sami',
  st: 'Southern Sotho',
  'es-ES': 'Spanish',
  'es-EM': 'Spanish (Modern)',
  'es-AR': 'Spanish, Argentina',
  'es-BO': 'Spanish, Bolivia',
  'es-CL': 'Spanish, Chile',
  'es-CO': 'Spanish, Colombia',
  'es-CR': 'Spanish, Costa Rica',
  'es-DO': 'Spanish, Dominican Republic',
  'es-EC': 'Spanish, Ecuador',
  'es-SV': 'Spanish, El Salvador',
  'es-GT': 'Spanish, Guatemala',
  'es-HN': 'Spanish, Honduras',
  'es-MX': 'Spanish, Mexico',
  'es-NI': 'Spanish, Nicaragua',
  'es-PA': 'Spanish, Panama',
  'es-PY': 'Spanish, Paraguay',
  'es-PE': 'Spanish, Peru',
  'es-PR': 'Spanish, Puerto Rico',
  'es-US': 'Spanish, United States',
  'es-UY': 'Spanish, Uruguay',
  'es-VE': 'Spanish, Venezuela',
  su: 'Sundanese',
  sw: 'Swahili',
  'sw-KE': 'Swahili, Kenya',
  'sw-TZ': 'Swahili, Tanzania',
  ss: 'Swati',
  'sv-SE': 'Swedish',
  'sv-FI': 'Swedish, Finland',
  syc: 'Syriac',
  tl: 'Tagalog',
  ty: 'Tahitian',
  tg: 'Tajik',
  tzl: 'Talossan',
  ta: 'Tamil',
  'tt-RU': 'Tatar',
  te: 'Telugu',
  kdh: 'Tem (Kotokoli)',
  th: 'Thai',
  'bo-BT': 'Tibetan',
  ti: 'Tigrinya',
  ts: 'Tsonga',
  tn: 'Tswana',
  tr: 'Turkish',
  'tr-CY': 'Turkish, Cyprus',
  tk: 'Turkmen',
  uk: 'Ukrainian',
  'hsb-DE': 'Upper Sorbian',
  'ur-IN': 'Urdu (India)',
  'ur-PK': 'Urdu (Pakistan)',
  ug: 'Uyghur',
  uz: 'Uzbek',
  'val-ES': 'Valencian',
  ve: 'Venda',
  vec: 'Venetian',
  vi: 'Vietnamese',
  wa: 'Walloon',
  cy: 'Welsh',
  wo: 'Wolof',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zea: 'Zeelandic',
  zu: 'Zulu',
};

ax.extensions.lib.locale.timezones = {
  'Pacific/Pago_Pago': '(GMT-11:00) American Samoa',
  'Pacific/Midway': '(GMT-11:00) Midway Island',
  'Pacific/Honolulu': '(GMT-10:00) Hawaii',
  'America/Juneau': '(GMT-09:00) Alaska',
  'America/New_York': '(GMT-05:00) Eastern Time (US & Canada)',
  'America/Tijuana': '(GMT-08:00) Tijuana',
  'America/Phoenix': '(GMT-07:00) Arizona',
  'America/Chihuahua': '(GMT-07:00) Chihuahua',
  'America/Mazatlan': '(GMT-07:00) Mazatlan',
  'America/Guatemala': '(GMT-06:00) Central America',
  'America/Mexico_City': '(GMT-06:00) Mexico City',
  'America/Monterrey': '(GMT-06:00) Monterrey',
  'America/Regina': '(GMT-06:00) Saskatchewan',
  'America/Bogota': '(GMT-05:00) Bogota',
  'America/Indiana/Indianapolis': '(GMT-05:00) Indiana (East)',
  'America/Lima': '(GMT-05:00) Quito',
  'America/Halifax': '(GMT-04:00) Atlantic Time (Canada)',
  'America/Caracas': '(GMT-04:00) Caracas',
  'America/Guyana': '(GMT-04:00) Georgetown',
  'America/La_Paz': '(GMT-04:00) La Paz',
  'America/Santiago': '(GMT-04:00) Santiago',
  'America/St_Johns': '(GMT-03:30) Newfoundland',
  'America/Sao_Paulo': '(GMT-03:00) Brasilia',
  'America/Argentina/Buenos_Aires': '(GMT-03:00) Buenos Aires',
  'America/Godthab': '(GMT-03:00) Greenland',
  'America/Montevideo': '(GMT-03:00) Montevideo',
  'Atlantic/South_Georgia': '(GMT-02:00) Mid-Atlantic',
  'Atlantic/Azores': '(GMT-01:00) Azores',
  'Atlantic/Cape_Verde': '(GMT-01:00) Cape Verde Is.',
  'Africa/Casablanca': '(GMT+00:00) Casablanca',
  'Europe/Dublin': '(GMT+00:00) Dublin',
  'Europe/London': '(GMT+00:00) London',
  'Europe/Lisbon': '(GMT+00:00) Lisbon',
  'Africa/Monrovia': '(GMT+00:00) Monrovia',
  'Etc/UTC': '(GMT+00:00) UTC',
  'Europe/Amsterdam': '(GMT+01:00) Amsterdam',
  'Europe/Belgrade': '(GMT+01:00) Belgrade',
  'Europe/Berlin': '(GMT+01:00) Berlin',
  'Europe/Zurich': '(GMT+01:00) Zurich',
  'Europe/Bratislava': '(GMT+01:00) Bratislava',
  'Europe/Brussels': '(GMT+01:00) Brussels',
  'Europe/Budapest': '(GMT+01:00) Budapest',
  'Europe/Copenhagen': '(GMT+01:00) Copenhagen',
  'Europe/Ljubljana': '(GMT+01:00) Ljubljana',
  'Europe/Madrid': '(GMT+01:00) Madrid',
  'Europe/Paris': '(GMT+01:00) Paris',
  'Europe/Prague': '(GMT+01:00) Prague',
  'Europe/Rome': '(GMT+01:00) Rome',
  'Europe/Sarajevo': '(GMT+01:00) Sarajevo',
  'Europe/Skopje': '(GMT+01:00) Skopje',
  'Europe/Stockholm': '(GMT+01:00) Stockholm',
  'Europe/Vienna': '(GMT+01:00) Vienna',
  'Europe/Warsaw': '(GMT+01:00) Warsaw',
  'Africa/Algiers': '(GMT+01:00) West Central Africa',
  'Europe/Zagreb': '(GMT+01:00) Zagreb',
  'Europe/Athens': '(GMT+02:00) Athens',
  'Europe/Bucharest': '(GMT+02:00) Bucharest',
  'Africa/Cairo': '(GMT+02:00) Cairo',
  'Africa/Harare': '(GMT+02:00) Harare',
  'Europe/Helsinki': '(GMT+02:00) Helsinki',
  'Asia/Jerusalem': '(GMT+02:00) Jerusalem',
  'Europe/Kaliningrad': '(GMT+02:00) Kaliningrad',
  'Europe/Kiev': '(GMT+02:00) Kyiv',
  'Africa/Johannesburg': '(GMT+02:00) Pretoria',
  'Europe/Riga': '(GMT+02:00) Riga',
  'Europe/Sofia': '(GMT+02:00) Sofia',
  'Europe/Tallinn': '(GMT+02:00) Tallinn',
  'Europe/Vilnius': '(GMT+02:00) Vilnius',
  'Asia/Baghdad': '(GMT+03:00) Baghdad',
  'Europe/Istanbul': '(GMT+03:00) Istanbul',
  'Asia/Kuwait': '(GMT+03:00) Kuwait',
  'Europe/Minsk': '(GMT+03:00) Minsk',
  'Europe/Moscow': '(GMT+03:00) St. Petersburg',
  'Africa/Nairobi': '(GMT+03:00) Nairobi',
  'Asia/Riyadh': '(GMT+03:00) Riyadh',
  'Europe/Volgograd': '(GMT+03:00) Volgograd',
  'Asia/Tehran': '(GMT+03:30) Tehran',
  'Asia/Muscat': '(GMT+04:00) Muscat',
  'Asia/Baku': '(GMT+04:00) Baku',
  'Europe/Samara': '(GMT+04:00) Samara',
  'Asia/Tbilisi': '(GMT+04:00) Tbilisi',
  'Asia/Yerevan': '(GMT+04:00) Yerevan',
  'Asia/Kabul': '(GMT+04:30) Kabul',
  'Asia/Yekaterinburg': '(GMT+05:00) Ekaterinburg',
  'Asia/Karachi': '(GMT+05:00) Karachi',
  'Asia/Tashkent': '(GMT+05:00) Tashkent',
  'Asia/Kolkata': '(GMT+05:30) New Delhi',
  'Asia/Colombo': '(GMT+05:30) Sri Jayawardenepura',
  'Asia/Kathmandu': '(GMT+05:45) Kathmandu',
  'Asia/Almaty': '(GMT+06:00) Almaty',
  'Asia/Dhaka': '(GMT+06:00) Dhaka',
  'Asia/Urumqi': '(GMT+06:00) Urumqi',
  'Asia/Rangoon': '(GMT+06:30) Rangoon',
  'Asia/Bangkok': '(GMT+07:00) Hanoi',
  'Asia/Jakarta': '(GMT+07:00) Jakarta',
  'Asia/Krasnoyarsk': '(GMT+07:00) Krasnoyarsk',
  'Asia/Novosibirsk': '(GMT+07:00) Novosibirsk',
  'Asia/Shanghai': '(GMT+08:00) Beijing',
  'Asia/Chongqing': '(GMT+08:00) Chongqing',
  'Asia/Hong_Kong': '(GMT+08:00) Hong Kong',
  'Asia/Irkutsk': '(GMT+08:00) Irkutsk',
  'Asia/Kuala_Lumpur': '(GMT+08:00) Kuala Lumpur',
  'Australia/Perth': '(GMT+08:00) Perth',
  'Asia/Singapore': '(GMT+08:00) Singapore',
  'Asia/Taipei': '(GMT+08:00) Taipei',
  'Asia/Ulaanbaatar': '(GMT+08:00) Ulaanbaatar',
  'Asia/Tokyo': '(GMT+09:00) Tokyo',
  'Asia/Seoul': '(GMT+09:00) Seoul',
  'Asia/Yakutsk': '(GMT+09:00) Yakutsk',
  'Australia/Adelaide': '(GMT+09:30) Adelaide',
  'Australia/Darwin': '(GMT+09:30) Darwin',
  'Australia/Brisbane': '(GMT+10:00) Brisbane',
  'Australia/Melbourne': '(GMT+10:00) Melbourne',
  'Pacific/Guam': '(GMT+10:00) Guam',
  'Australia/Hobart': '(GMT+10:00) Hobart',
  'Pacific/Port_Moresby': '(GMT+10:00) Port Moresby',
  'Australia/Sydney': '(GMT+10:00) Sydney',
  'Asia/Vladivostok': '(GMT+10:00) Vladivostok',
  'Asia/Magadan': '(GMT+11:00) Magadan',
  'Pacific/Noumea': '(GMT+11:00) New Caledonia',
  'Pacific/Guadalcanal': '(GMT+11:00) Solomon Is.',
  'Asia/Srednekolymsk': '(GMT+11:00) Srednekolymsk',
  'Pacific/Auckland': '(GMT+12:00) Wellington',
  'Pacific/Fiji': '(GMT+12:00) Fiji',
  'Asia/Kamchatka': '(GMT+12:00) Kamchatka',
  'Pacific/Majuro': '(GMT+12:00) Marshall Is.',
  'Pacific/Chatham': '(GMT+12:45) Chatham Is.',
  'Pacific/Tongatapu': "(GMT+13:00) Nuku'alofa",
  'Pacific/Apia': '(GMT+13:00) Samoa',
  'Pacific/Fakaofo': '(GMT+13:00) Tokelau Is.',
};

ax.extensions.report.field.extras = {};

ax.extensions.form.field.extras.controls = {};

ax.extensions.form.field.extras.shim = {
  controls: {
    language: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.language(f, options),
    timezone: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.timezone(f, options),
    country: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.country(f, options),
    multiselect: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.multiselect(f, options),
    selectinput: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.selectinput(f, options),
    password: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.password(f, options),
  },
};

ax.extensions.report.field.extras.controls = {};

ax.extensions.report.field.extras.shim = {
  controls: {
    boolean: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.boolean(r, options),
    language: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.language(r, options),
    timezone: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.timezone(r, options),
    country: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.country(r, options),
    color: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.color(r, options),
    datetime: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.datetime(r, options),
    email: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.email(r, options),
    tel: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.tel(r, options),
    url: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.url(r, options),
    number: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.number(r, options),
    password: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.password(r, options),
    preformatted: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.preformatted(r, options),
    json: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.json(r, options),
  },
};

ax.extensions.form.field.extras.controls.country = (f, options = {}) => {
  let selectOptions = {
    ...options,
    value: options.value,
    selections: x.lib.locale.countries,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('select').value;
    },
    $focus: (el) => () => {
      el.$('select').focus();
    },

    $enabled: !selectOptions.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!selectOptions.disabled) {
        el.$enabled = true;
        el.$('select').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        let el = e.currentTarget;
        if (selectOptions.readonly) e.preventDefault();
      },
      'change:': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-country'](
      f.select(selectOptions),
      options.countryTag || {}
    ),
    controlTagOptions
  );
};

ax.extensions.form.field.extras.controls.language = (f, options = {}) => {
  let selectOptions = {
    ...options,
    value: options.value,
    selections: x.lib.locale.languages,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('select').value;
    },
    $focus: (el) => () => {
      el.$('select').focus();
    },

    $enabled: !selectOptions.disabled,

    $disable: (el) => () => {
      el.$enabled = false;
      el.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!selectOptions.disabled) {
        el.$enabled = true;
        el.$('select').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        let el = e.currentTarget;
        if (selectOptions.readonly) e.preventDefault();
      },
      'change:': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-language'](
      f.select(selectOptions),
      options.languageTag || {}
    ),
    controlTagOptions
  );
};

ax.extensions.form.field.extras.controls.multiselect = function (
  f,
  options = {}
) {
  options.value = x.lib.form.collection.value(options.value);

  options.selections = x.lib.form.selections(options.selections);

  let controlTagOptions = {
    name: options.name,
    $init: (el) => {
      el.$preselect();
    },

    $value: (el) => () => {
      return el
        .$('ax-appkit-form-multiselect-selected')
        .$selected.map(function (item) {
          return item.value;
        });
    },

    $data: (el) => () => {
      return el.$value();
    },

    $focus: (el) => () => {
      el.$('select').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$$('ax-appkit-form-multiselect-selected-item-remove').$disable();
      el.$('select').setAttribute('disabled', 'disabled');
    },
    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$$('ax-appkit-form-multiselect-selected-item-remove').$enable();
        el.$('select').removeAttribute('disabled');
      }
    },

    $preselect: (el) => () => {
      let items = [];
      let select = el.$('select');
      let selections = Array.apply(select.options);

      options.value.map((itemValue) => {
        selections.forEach((selection, i) => {
          if (selection.value.toString() == itemValue.toString()) {
            items.push({
              index: i,
              value: itemValue,
              label: selection.text,
            });
            selection.disabled = 'disabled';
          }
        });
      });
      el.$('ax-appkit-form-multiselect-selected').$update(items);
    },

    $on: {
      'ax.appkit.form.multiselect.selected.change: send control change event': (
        e
      ) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },

    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-multiselect'](
      [
        x.form.field.extras.controls.multiselect.select(f, options),
        x.form.field.extras.controls.multiselect.selected(f, options),
      ],
      options.multiselectTag || {}
    ),
    controlTagOptions
  );
};

ax.extensions.form.field.extras.controls.password = function (f, options) {
  if (options.confirmation == true) {
    options.confirmation = {};
  }

  let secure = function (element) {
    if (element.value) {
      element.style.fontFamily = 'text-security-disc';
    } else {
      element.style.fontFamily = 'unset';
    }
  };

  let inputOptions = {
    name: options.name,
    value: options.value,
    placeholder: options.placeholder,
    disabled: options.disabled,
    readonly: options.readonly,
    required: options.required,
    pattern: options.pattern,
    autocomplete: 'off',
    ...options.input,
    inputTag: {
      $valid: (el) => () => {
        el.setCustomValidity('');
        if (el.validity.valid) {
          return true;
        } else {
          if (options.invalid) {
            if (ax.is.function(options.invalid)) {
              let invalidMessage = options.invalid(el.value, el.validity);
              if (invalidMessage) {
                el.setCustomValidity(invalidMessage);
              }
            } else {
              el.setCustomValidity(options.invalid);
            }
          }
          return false;
        }
      },

      ...(options.input || {}).inputTag,
    },
  };

  let confirmation = () => {
    let confirmationInputOptions = {
      value: options.value,
      disabled: options.disabled,
      readonly: options.readonly,
      autocomplete: 'off',
      ...options.confirmation,
      inputTag: {
        $valid: (el) => () => {
          let input = el.$('^ax-appkit-form-control').$('input');
          if (input.value == el.value) {
            el.setCustomValidity('');
          } else {
            el.setCustomValidity('Passwords must match.');
          }
        },

        ...(options.confirmation || {}).inputTag,
      },
    };

    return f.input(confirmationInputOptions);
  };

  let controlTagOptions = {
    $init: (el) => {
      for (let input of el.$inputs()) {
        secure(input);
        input.$valid();
      }
    },

    $inputs: (el) => () => {
      return el.$$('input');
    },

    $value: (el) => () => {
      return el.$inputs()[0].value;
    },

    $focus: (el) => () => {
      el.$inputs()[0].focus();
    },

    $enabled: !inputOptions.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      for (let input of el.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: (el) => () => {
      if (!inputOptions.disabled) {
        el.$enabled = true;
        for (let input of el.$inputs()) {
          input.removeAttribute('disabled');
        }
      }
    },

    ...options.controlTag,

    $on: {
      'input: secure text': (e) => {
        let el = e.currentTarget;
        for (let input of el.$inputs()) {
          secure(input);
        }
      },
      'input: check validity': (e) => {
        let el = e.currentTarget;
        for (let input of el.$inputs()) {
          input.$valid();
        }
      },
      'input: send control change event': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-password'](
      [f.input(inputOptions), options.confirmation ? confirmation() : ''],
      options.passwordTag || {}
    ),
    controlTagOptions
  );
};

ax.extensions.form.field.extras.controls.selectinput = (f, options = {}) => {
  let selections = x.lib.form.selections(options.selections);
  selections.push({
    disabled: 'hr',
  });
  selections.push({
    value: '__USE_INPUT__',
    label: options.customValueLabel || '⬇ Enter a value',
  });

  let selectValue;
  let inputValue;

  if (options.value) {
    let valueInselections = selections.some(
      (option) => option.value == options.value
    );
    selectValue = valueInselections ? options.value : '__USE_INPUT__';
    inputValue = valueInselections ? '' : options.value;
  } else {
    // If no value and no placeholder then show the input
    selectValue = options.placeholder ? '' : '__USE_INPUT__';
  }

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('ax-appkit-control-selectinput-hiddeninput input').value;
    },
    $focus: (el) => () => {
      let select = el.$('select');
      if (select.value === '__USE_INPUT__') {
        el.$('ax-appkit-control-selectinput-input input').focus();
      } else {
        select.focus();
      }
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      let select = el.$('ax-appkit-control-selectinput-select select');
      let input = el.$('ax-appkit-control-selectinput-input input');
      let hiddeninput = el.$('ax-appkit-control-selectinput-hiddeninput input');
      select.disabled = 'disabled';
      input.disabled = 'disabled';
      hiddeninput.disabled = 'disabled';
    },
    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        let select = el.$('ax-appkit-control-selectinput-select select');
        let input = el.$('ax-appkit-control-selectinput-input input');
        let hiddeninput = el.$(
          'ax-appkit-control-selectinput-hiddeninput input'
        );
        select.removeAttribute('disabled');
        input.removeAttribute('disabled');
        hiddeninput.removeAttribute('disabled');
      }
    },
    $on: {
      change: (e) => {
        let el = e.currentTarget;
        let select = el.$('select');
        let input = el.$('ax-appkit-control-selectinput-input input');
        let hiddeninput = el.$(
          'ax-appkit-control-selectinput-hiddeninput input'
        );
        if (select.value === '__USE_INPUT__') {
          input.style.display = '';
          hiddeninput.value = input.value;
          if (options.required) {
            select.removeAttribute('required');
            input.required = 'required';
          }
          if (select == window.document.activeElement) {
            input.focus();
          }
        } else {
          input.style.display = 'none';
          hiddeninput.value = select.value;
          if (options.required) {
            input.removeAttribute('required');
            select.required = 'required';
          }
        }
      },
    },

    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-selectinput'](
      [
        a['ax-appkit-control-selectinput-hiddeninput'](
          f.input({
            name: options.name,
            value: options.value,
            type: 'hidden',
            ...options.hiddeninput,
          })
        ),
        a['ax-appkit-control-selectinput-select'](
          f.select({
            value: selectValue,
            selections: selections,
            placeholder: options.placeholder,
            disabled: options.disabled,
            required: options.required,
            ...options.select,
          })
        ),
        a['ax-appkit-control-selectinput-input'](
          f.input({
            value: inputValue,
            disabled: options.disabled,
            ...options.input,
            inputTag: {
              style:
                selectValue == '__USE_INPUT__'
                  ? {}
                  : {
                      display: 'none',
                    },
              ...(options.input || {}).inputTag,
            },
          })
        ),
      ],
      options.selectinputTag || {}
    ),
    controlTagOptions
  );
};

ax.extensions.form.field.extras.controls.timezone = (f, options = {}) => {
  let selectOptions = {
    ...options,
    value: options.value || Intl.DateTimeFormat().resolvedOptions().timeZone,
    selections: x.lib.locale.timezones,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('select').value;
    },
    $focus: (el) => () => {
      el.$('select').focus();
    },

    $enabled: !selectOptions.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!selectOptions.disabled) {
        el.$enabled = true;
        el.$('select').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        let el = e.currentTarget;
        if (selectOptions.readonly) e.preventDefault();
      },
      'change:': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-timezone'](
      f.select(selectOptions),
      options.timezoneTag || {}
    ),
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.boolean = (r, options = {}) => {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-boolean').focus();
    },

    ...options.controlTag,
  };

  let label = options.label || {};

  let trueLabel = label.true || '✔ True';
  let falseLabel = label.false || '❌ False';

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-boolean'](options.value ? trueLabel : falseLabel, {
        tabindex: 0,
        ...options.booleanTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.color = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    component = a.div({
      style: {
        backgroundColor: options.value,
        height: '100%',
      },
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-color').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-color'](component, {
        tabindex: 0,
        ...options.colorTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.country = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    label = x.lib.locale.countries[value];
    if (label) {
      component = label;
    } else {
      component = value;
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-country').focus();
    },

    ...options.controlTag,
  };

  let selectOptions = {
    ...options,
    selections: x.lib.locale.countries,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-country'](component, {
        tabindex: 0,
        ...options.countryTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.datetime = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    if (options.only === 'time') {
      component = new Date(value).toTimeString();
    } else if (options.only === 'date') {
      component = new Date(value).toDateString();
    } else {
      component = new Date(value).toString();
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-datetime').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-datetime'](component, {
        tabindex: 0,
        ...options.datetimeTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.email = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: `mailto: ${value}`,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-email').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-email'](component, {
        tabindex: 0,
        ...options.emailTag,
      }),
      r.validation({
        controlPattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        controlInvalid: 'Should be an email address.',
        ...options,
      }),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.json = function (r, options) {
  let value = options.value;
  let component;

  if (value) {
    if (options.parse) {
      try {
        component = JSON.stringify(JSON.parse(value), null, 2);
      } catch (error) {
        component = a['.error'](`⚠ ${error.message}`);
      }
    } else {
      component = JSON.stringify(value, null, 2);
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('pre').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-json'](
        a.pre(component, {
          tabindex: 0,
          ...options.preTag,
        }),
        options.jsonTag || {}
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.language = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    let label = x.lib.locale.languages[value];
    if (label) {
      component = `${value} - ${label}`;
    } else {
      component = value;
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-language').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-language'](component, {
        tabindex: 0,
        ...options.languageTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.number = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    component = Number(value);
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-number').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-number'](component, {
        tabindex: 0,
        ...options.numberTag,
      }),
      r.validation({
        controlPattern: /^[+-]?([0-9]*[.])?[0-9]+$/,
        controlInvalid: 'Should be a number.',
        ...options,
      }),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.password = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-password').focus();
    },

    ...options.controlTag,
  };

  let passwordTagOptions = {
    $init: (el) => {
      el.style.fontFamily = 'text-security-disc';
    },
    ...options.passwordTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-password'](
        options.value
          ? [
              a['ax-appkit-report-password-text']({
                $nodes: (el) => {
                  let flag = el.$showPassword;
                  if (flag > 0) {
                    el.style.fontFamily = 'text-security-disc';
                    el.classList.add('secure-text');
                  } else {
                    el.style.fontFamily = 'monospace';
                    el.classList.remove('secure-text');
                  }
                  return a({
                    $text: options.value || '',
                  });
                },
                $showPassword: 1,
                ...options.textTag,
              }),
              x.button({
                label: '👁',
                onclick: (e) => {
                  let el = e.currentTarget;
                  let text = el.$(
                    '^ax-appkit-report-password ax-appkit-report-password-text'
                  );
                  text.$showPassword = text.$showPassword * -1;
                  el.$render();
                },
                ...options.button,
              }),
            ]
          : a['i.placeholder'](
              ax.is.undefined(options.placeholder) ? '' : options.placeholder
            ),
        {
          tabindex: 0,
          ...options.passwordTag,
        }
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.preformatted = (r, options = {}) => {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('pre').focus();
    },

    ...options.controlTag,
  };

  let component;

  if (options.value) {
    component = options.value || '';
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-preformatted'](
        a.pre(component, {
          tabindex: 0,
          ...options.preTag,
        }),
        options.preformattedTag || {}
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.tel = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: `tel: ${value}`,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-tel').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-tel'](component, {
        tabindex: 0,
        ...options.telTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.timezone = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    label = x.lib.locale.timezones[value];
    if (label) {
      component = label;
    } else {
      component = value;
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-timezone').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-timezone'](component, {
        tabindex: 0,
        ...options.timezoneTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extensions.report.field.extras.controls.url = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: value,
      target: value,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-url').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-url'](component, {
        tabindex: 0,
        ...options.urlTag,
      }),
      r.validation({
        controlPattern: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
        controlInvalid: 'Should be a valid URL.',
        ...options,
      }),
    ],
    controlTagOptions
  );
};

ax.css({
  'ax-appkit-form-multiselect-selected-item': {
    $: {
      display: 'block',
      overflow: 'auto',
    },
  },
  'ax-appkit-form-multiselect-selected-item-label': {
    $: {
      verticalAlign: 'middle',
    },
  },
  'ax-appkit-form-multiselect-selected-item-remove': {
    $: {
      float: 'right',
    },
    button: {
      $: {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        margin: '1px',
      },
    },
  },
});

ax.extensions.form.field.extras.controls.multiselect.select = function (
  f,
  options = {}
) {
  return f.select(
    // No name on select. Field name goes on hidden inputs.
    {
      placeholder: options.placeholder || '＋ Add',
      ...options.select,
      selections: options.selections,
      selectTag: {
        $on: {
          'change: add item to selection': (e) => {
            let el = e.currentTarget;
            el.$(
              '^ax-appkit-form-control ax-appkit-form-multiselect-selected'
            ).$add({
              index: el.selectedIndex,
              value: el.value,
              label: el.options[el.selectedIndex].text,
            });
            el.$disableSelected();
          },
        },

        $disableSelected: (el) => () => {
          el.options[el.selectedIndex].disabled = 'disabled';
          el.selectedIndex = 0;
        },

        $enableDeselected: (el) => (index) => {
          el.options[index].removeAttribute('disabled');
        },

        ...(options.select || {}).selectTag,
      },
    }
  );
};

ax.extensions.form.field.extras.controls.multiselect.selected = function (
  f,
  options = {}
) {
  return a['ax-appkit-form-multiselect-selected']({
    $selected: [],

    $remove: (el) => (item) => {
      let selected = [...el.$selected];
      let index = selected.indexOf(item);
      if (index !== -1) {
        selected.splice(index, 1);
        el.$update(selected);
      }
      el.$send('ax.appkit.form.multiselect.selected.change');
    },

    $add: (el) => (item, index) => {
      el.$update([item].concat(el.$selected));
      el.$send('ax.appkit.form.multiselect.selected.change');
    },

    $update: (el) => (selected) => {
      el.$selected = selected;
      if (el.$selected.length === 0) {
        el.style.display = 'none';
        el.$('^ax-appkit-form-multiselect-selected').previousSibling.required =
          options.required;
        el.$nodes = [
          f.input({
            name: options.name + '[]',
            disabled: true,
            inputTag: {
              type: 'hidden',
            },
          }),
        ];
      } else {
        el.style.display = '';
        el.$(
          '^ax-appkit-form-multiselect-selected'
        ).previousSibling.removeAttribute('required');
        el.$nodes = el.$selected.map(function (item) {
          return a['ax-appkit-form-multiselect-selected-item'](
            [
              a['ax-appkit-form-multiselect-selected-item-label'](item.label),
              a['ax-appkit-form-multiselect-selected-item-remove'](
                a.button('✖', { type: 'button' }),
                {
                  $on: {
                    'click: remove item from selection': (e) => {
                      let el = e.currentTarget;
                      if (!el.disabled) {
                        el.$('^ax-appkit-form-control')
                          .$('select')
                          .$enableDeselected(item.index);
                        el.$('^ax-appkit-form-multiselect-selected').$remove(
                          item
                        );
                      }
                    },
                  },
                  $enabled: true,
                  $disable: (el) => () => {
                    el.$enabled = false;
                    el.$('button').disabled = 'disabled';
                  },
                  $enable: (el) => () => {
                    el.$enabled = true;
                    el.$('button').removeAttribute('disabled');
                  },
                }
              ),
              f.input({
                name: options.name + '[]',
                required: options.required,
                value: item.value,
                inputTag: {
                  type: 'hidden',
                },
              }),
            ],
            options.itemTag || {}
          );
        });
      }
    },
    ...options.selectedTag,
  });
};

ax.css({
  'ax-appkit-report-password': {
    button: {
      $: {
        fontSize: '1em',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        float: 'right',
      },
    },
  },
});

}));
