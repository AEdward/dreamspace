"use strict";

const mysql = require("mysql2/promise");

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST ?? "127.0.0.1",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  const [existingSettings] = await connection.query("SELECT id FROM site_settings LIMIT 1");
  if (existingSettings.length === 0) {
    await connection.query(
      `INSERT INTO site_settings
        (site_name, hero_headline, hero_subheadline, hero_image_url, logo_url, phone, email, secondary_email,
         register_cta_label, appointment_cta_label, popup_enabled, popup_headline, footer_credit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Dreamspace Realty",
        "We will make it happen!",
        null,
        "/brand/hero.jpg",
        "/brand/logo.png",
        "+251 90 396 8896",
        "info@dreamspacerbg.com",
        "office@dreamspacerbg.com",
        "Book Now",
        "Make an appointment now!",
        1,
        "We are running a limited time registration. Hurry up!",
        "buildwithanahom",
      ]
    );
    console.log("  + site_settings created");
  } else {
    console.log("  = site_settings already exists, skipping");
  }

  const valueProps = [
    {
      title: "Affordable housing development",
      description: "We will build affordable and quality residential communities in a planned and fast manner.",
      sort_order: 1,
    },
    {
      title: "Homeownership Solutions",
      description:
        "With flexible financing options, payment plans, and co-op housing models, helping individuals and families find their first home in an easy way.",
      sort_order: 2,
    },
    {
      title: "Sustainable construction",
      description:
        "We believe in building tomorrow. Our homes are designed for sustainability and we also strive to be environmentally friendly.",
      sort_order: 3,
    },
    {
      title: "Real estate investment opportunities",
      description:
        "We offer structured real estate investment packages to individuals and groups looking to build wealth together.",
      sort_order: 4,
    },
    {
      title: "Land development and property management",
      description:
        "From land acquisition to community planning, as well as asset management, we provide end-to-end solutions that ensure long-term satisfaction and responsible urban development.",
      sort_order: 5,
    },
  ];
  for (const vp of valueProps) {
    const [existing] = await connection.query("SELECT id FROM value_props WHERE title = ?", [vp.title]);
    if (existing.length === 0) {
      await connection.query("INSERT INTO value_props (title, description, sort_order) VALUES (?, ?, ?)", [
        vp.title,
        vp.description,
        vp.sort_order,
      ]);
    }
  }
  console.log(`  + value_props seeded (${valueProps.length})`);

  const unitTypes = [
    {
      name: "1 Bed Room",
      sort_order: 1,
      sqm: 50,
      bedrooms: 1,
      bathrooms: 1,
      down_payment: 100080,
      service_fee: 38920,
      monthly_savings: 3000,
      monthly_service_fee: 790,
      final_service_fee_after_draw: 220000,
      total_construction_cost: 3150000,
    },
    {
      name: "2 Bed Room",
      sort_order: 2,
      sqm: 80,
      bedrooms: 2,
      bathrooms: 1,
      down_payment: 128440,
      service_fee: 40560,
      monthly_savings: 4000,
      monthly_service_fee: 790,
      final_service_fee_after_draw: 270000,
      total_construction_cost: 5040000,
    },
    {
      name: "3 Bed Room",
      sort_order: 3,
      sqm: 105,
      bedrooms: 3,
      bathrooms: 2,
      down_payment: 155220,
      service_fee: 43780,
      monthly_savings: 5000,
      monthly_service_fee: 790,
      final_service_fee_after_draw: 330000,
      total_construction_cost: 6615000,
    },
  ];
  for (const ut of unitTypes) {
    const [existing] = await connection.query("SELECT id FROM unit_types WHERE name = ?", [ut.name]);
    if (existing.length === 0) {
      await connection.query(
        `INSERT INTO unit_types
          (name, sort_order, sqm, bedrooms, bathrooms, down_payment, service_fee, monthly_savings,
           monthly_service_fee, final_service_fee_after_draw, total_construction_cost, currency)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Birr')`,
        [
          ut.name,
          ut.sort_order,
          ut.sqm,
          ut.bedrooms,
          ut.bathrooms,
          ut.down_payment,
          ut.service_fee,
          ut.monthly_savings,
          ut.monthly_service_fee,
          ut.final_service_fee_after_draw,
          ut.total_construction_cost,
        ]
      );
    }
  }
  console.log(`  + unit_types seeded (${unitTypes.length})`);

  const offices = [
    {
      name: "Chamber of Commerce (Mexico)",
      sort_order: 1,
      address: "Chamber of Commerce, 4th Floor, Office No. 411, next to the Mexican Federal Police Headquarters",
      phones: ["0902171346", "0902174809", "0902174490", "0902174101", "0902175202", "0998991444"],
    },
    {
      name: "Air Health",
      sort_order: 2,
      address: "Air Health, Kesami Cafe, Alef Blo Mas Zone, Cafe 4th Floor, Office No. 403",
      phones: ["0902174939", "0902175563", "0902175008", "099 894 7444", "099 883 4255"],
    },
    {
      name: "City Mall",
      sort_order: 3,
      address: "City Mall, 10th Floor, Office No. 07, next to the Sileshi Building",
      phones: ["0902170467", "0902173106", "0902175240", "0998977444", "0998834714"],
    },
    {
      name: "Gelan City",
      sort_order: 4,
      address: "Gelan City, near Atlas Resort",
      phones: ["099 889 9777", "099 886 0777", "099 880 3777", "099 881 2777", "099 881 6444"],
    },
    { name: "Barn (Construction Site)", sort_order: 5, address: "Barn construction site", phones: [], site: true },
    { name: "Goro (Construction Site)", sort_order: 6, address: "Goro construction site", phones: [], site: true },
    {
      name: "Koye Feche, Sheger City (Construction Site)",
      sort_order: 7,
      address: "Koye Feche, Sheger City construction site",
      phones: [],
      site: true,
    },
  ];
  for (const office of offices) {
    const [existing] = await connection.query("SELECT id FROM offices WHERE name = ?", [office.name]);
    if (existing.length === 0) {
      const [result] = await connection.query(
        "INSERT INTO offices (name, sort_order, address, is_construction_site) VALUES (?, ?, ?, ?)",
        [office.name, office.sort_order, office.address, office.site ? 1 : 0]
      );
      const officeId = result.insertId;
      for (let i = 0; i < office.phones.length; i++) {
        await connection.query("INSERT INTO office_phones (office_id, number, sort_order) VALUES (?, ?, ?)", [
          officeId,
          office.phones[i],
          i,
        ]);
      }
    }
  }
  console.log(`  + offices seeded (${offices.length})`);

  const posts = [
    {
      title: "Renting vs. Buying in Addis: Which One is Right for You?",
      slug: "renting-vs-buying-in-addis-which-one-is-right-for-you",
      excerpt:
        "Choosing between renting or buying a home is a major financial and lifestyle decision, especially in a city like Addis Ababa, where housing demand is rising. While renting offers flexibility, buying a home provides long-term stability and investment value.",
      published_date: "2025-07-13",
    },
    {
      title: "Home Loans in Ethiopia: How to Finance Your Dream Home",
      slug: "home-loans-in-ethiopia-how-to-finance-your-dream-home",
      excerpt:
        "Owning a home is one of the biggest milestones in life, but financing it can feel overwhelming, especially for first-time buyers. Home loans in Ethiopia are becoming more accessible, with banks, microfinance institutions, and developers offering more options.",
      published_date: "2025-07-13",
    },
    {
      title: "Step-by-Step Guide to Buying Your First Home in Ethiopia",
      slug: "step-by-step-guide-to-buying-your-first-home-in-ethiopia",
      excerpt:
        "Buying your first home is one of the most exciting and life-changing decisions you'll ever make. In Ethiopia, especially in cities like Addis Ababa, homeownership is becoming increasingly possible, even for middle- and lower-income earners.",
      published_date: "2025-07-13",
    },
  ];
  for (const post of posts) {
    const [existing] = await connection.query("SELECT id FROM posts WHERE slug = ?", [post.slug]);
    if (existing.length === 0) {
      await connection.query(
        "INSERT INTO posts (title, slug, excerpt, content, author, category, published_date) VALUES (?, ?, ?, ?, 'admin', 'Uncategorized', ?)",
        [
          post.title,
          post.slug,
          post.excerpt,
          `${post.excerpt}\n\n_Full article content to be migrated from the original site._`,
          post.published_date,
        ]
      );
    }
  }
  console.log(`  + posts seeded (${posts.length})`);

  const partners = [{ name: "Harmony Builders", sort_order: 1 }];
  for (const partner of partners) {
    const [existing] = await connection.query("SELECT id FROM partners WHERE name = ?", [partner.name]);
    if (existing.length === 0) {
      await connection.query("INSERT INTO partners (name, sort_order) VALUES (?, ?)", [
        partner.name,
        partner.sort_order,
      ]);
    }
  }
  console.log(`  + partners seeded (${partners.length})`);

  const bankAccounts = [
    {
      bank_name: "ጎህ ቤቶች ባንክ",
      registration_account: "10000005071331",
      price_account: "1000000510525",
      sort_order: 1,
    },
    {
      bank_name: "የኢትዮጵያ ንግድ ባንክ",
      registration_account: "1000713563319",
      price_account: "1000690236625",
      sort_order: 2,
    },
  ];
  for (const account of bankAccounts) {
    const [existing] = await connection.query("SELECT id FROM bank_accounts WHERE bank_name = ?", [
      account.bank_name,
    ]);
    if (existing.length === 0) {
      await connection.query(
        "INSERT INTO bank_accounts (bank_name, registration_account, price_account, sort_order) VALUES (?, ?, ?, ?)",
        [account.bank_name, account.registration_account, account.price_account, account.sort_order]
      );
    }
  }
  console.log(`  + bank_accounts seeded (${bankAccounts.length})`);

  console.log("\nSeed complete.");
  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
