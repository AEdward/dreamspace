'use strict';

/**
 * One-off seed script that populates Strapi with the real content pulled
 * from the original dreamspacerbg.com WordPress export, so the Next.js
 * frontend has real data to render against during development.
 *
 * Usage: node scripts/seed.js
 * (run from the cms/ directory, with the DB reachable per .env)
 */

const path = require('path');
const fs = require('fs');
const { compileStrapi, createStrapi } = require('@strapi/strapi');

const ASSET_DIR = process.env.SEED_ASSET_DIR || path.join(__dirname, '..', '..', 'web', 'public', 'brand');

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uploadImage(strapi, filename, altText) {
  const filePath = path.join(ASSET_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  [skip] asset not found: ${filePath}`);
    return null;
  }
  const stat = fs.statSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const mime =
    ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';

  const uploadService = strapi.plugin('upload').service('upload');
  const [file] = await uploadService.upload({
    data: { fileInfo: { alternativeText: altText, caption: altText, name: altText } },
    files: { filepath: filePath, originalFilename: filename, mimetype: mime, size: stat.size },
  });
  return file;
}

async function seed() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    const logo = await uploadImage(app, 'logo.png', 'Dreamspace Realty logo');
    const hero = await uploadImage(app, 'hero.jpg', 'Dreamspace Realty apartment complex render');

    const settingsExisting = await app.documents('api::site-setting.site-setting').findFirst();
    if (!settingsExisting) {
      await app.documents('api::site-setting.site-setting').create({
        data: {
          siteName: 'Dreamspace Realty',
          heroHeadline: 'We will make it happen!',
          heroSubheadline: 'Register from home!',
          heroImage: hero ? hero.id : undefined,
          logo: logo ? logo.id : undefined,
          phone: '+251 90 396 8896',
          email: 'info@dreamspacerbg.com',
          secondaryEmail: 'office@dreamspacerbg.com',
          registerCtaLabel: 'Register from home!',
          appointmentCtaLabel: 'Make an appointment now!',
          popupEnabled: true,
          popupHeadline: 'We are running a limited time registration. Hurry up!',
          footerCredit: 'buildwithanahom',
          publishedAt: new Date(),
        },
      });
      console.log('  + site-setting created');
    } else {
      console.log('  = site-setting already exists, skipping');
    }

    const valueProps = [
      {
        title: 'Affordable housing development',
        description:
          'We will build affordable and quality residential communities in a planned and fast manner.',
        order: 1,
      },
      {
        title: 'Homeownership Solutions',
        description:
          'With flexible financing options, payment plans, and co-op housing models, helping individuals and families find their first home in an easy way.',
        order: 2,
      },
      {
        title: 'Sustainable construction',
        description:
          'We believe in building tomorrow. Our homes are designed for sustainability and we also strive to be environmentally friendly.',
        order: 3,
      },
      {
        title: 'Real estate investment opportunities',
        description:
          'We offer structured real estate investment packages to individuals and groups looking to build wealth together.',
        order: 4,
      },
      {
        title: 'Land development and property management',
        description:
          'From land acquisition to community planning, as well as asset management, we provide end-to-end solutions that ensure long-term satisfaction and responsible urban development.',
        order: 5,
      },
    ];
    for (const vp of valueProps) {
      const found = await app.documents('api::value-prop.value-prop').findFirst({ filters: { title: vp.title } });
      if (!found) {
        await app.documents('api::value-prop.value-prop').create({ data: { ...vp }, status: 'published' });
      }
    }
    console.log(`  + value-props seeded (${valueProps.length})`);

    const unitTypes = [
      {
        name: '1 Bed Room',
        order: 1,
        sqm: 50,
        bedrooms: 1,
        bathrooms: 1,
        downPayment: 100080,
        serviceFee: 38920,
        monthlySavings: 3000,
        monthlyServiceFee: 790,
        finalServiceFeeAfterDraw: 220000,
        totalConstructionCost: 3150000,
      },
      {
        name: '2 Bed Room',
        order: 2,
        sqm: 80,
        bedrooms: 2,
        bathrooms: 1,
        downPayment: 128440,
        serviceFee: 40560,
        monthlySavings: 4000,
        monthlyServiceFee: 790,
        finalServiceFeeAfterDraw: 270000,
        totalConstructionCost: 5040000,
      },
      {
        name: '3 Bed Room',
        order: 3,
        sqm: 105,
        bedrooms: 3,
        bathrooms: 2,
        downPayment: 155220,
        serviceFee: 43780,
        monthlySavings: 5000,
        monthlyServiceFee: 790,
        finalServiceFeeAfterDraw: 330000,
        totalConstructionCost: 6615000,
      },
    ];
    for (const ut of unitTypes) {
      const found = await app.documents('api::unit-type.unit-type').findFirst({ filters: { name: ut.name } });
      if (!found) {
        await app
          .documents('api::unit-type.unit-type')
          .create({ data: { ...ut, currency: 'Birr' }, status: 'published' });
      }
    }
    console.log(`  + unit-types seeded (${unitTypes.length})`);

    const offices = [
      {
        name: 'Chamber of Commerce (Mexico)',
        order: 1,
        address: 'Chamber of Commerce, 4th Floor, Office No. 411, next to the Mexican Federal Police Headquarters',
        phones: [
          { label: 'Mexico office', number: '0902171346' },
          { label: 'Mexico office', number: '0902174809' },
          { label: 'Mexico office', number: '0902174490' },
          { label: 'Mexico office', number: '0902174101' },
          { label: 'Mexico office', number: '0902175202' },
          { label: 'Mexico office', number: '0998991444' },
        ],
      },
      {
        name: 'Air Health',
        order: 2,
        address: 'Air Health, Kesami Cafe, Alef Blo Mas Zone, Cafe 4th Floor, Office No. 403',
        phones: [
          { label: 'Air Health office', number: '0902174939' },
          { label: 'Air Health office', number: '0902175563' },
          { label: 'Air Health office', number: '0902175008' },
          { label: 'Air Health office', number: '099 894 7444' },
          { label: 'Air Health office', number: '099 883 4255' },
        ],
      },
      {
        name: 'City Mall',
        order: 3,
        address: 'City Mall, 10th Floor, Office No. 07, next to the Sileshi Building',
        phones: [
          { label: 'Contact office', number: '0902170467' },
          { label: 'Contact office', number: '0902173106' },
          { label: 'Contact office', number: '0902175240' },
          { label: 'Contact office', number: '0998977444' },
          { label: 'Contact office', number: '0998834714' },
        ],
      },
      {
        name: 'Gelan City',
        order: 4,
        address: 'Gelan City, near Atlas Resort',
        phones: [
          { label: 'Gelan office', number: '099 889 9777' },
          { label: 'Gelan office', number: '099 886 0777' },
          { label: 'Gelan office', number: '099 880 3777' },
          { label: 'Gelan office', number: '099 881 2777' },
          { label: 'Gelan office', number: '099 881 6444' },
        ],
      },
      {
        name: 'Barn (Construction Site)',
        order: 5,
        address: 'Barn construction site',
        phones: [],
        isConstructionSite: true,
      },
      {
        name: 'Goro (Construction Site)',
        order: 6,
        address: 'Goro construction site',
        phones: [],
        isConstructionSite: true,
      },
      {
        name: 'Koye Feche, Sheger City (Construction Site)',
        order: 7,
        address: 'Koye Feche, Sheger City construction site',
        phones: [],
        isConstructionSite: true,
      },
    ];
    for (const office of offices) {
      const found = await app.documents('api::office.office').findFirst({ filters: { name: office.name } });
      if (!found) {
        await app.documents('api::office.office').create({ data: { ...office }, status: 'published' });
      }
    }
    console.log(`  + offices seeded (${offices.length})`);

    const posts = [
      {
        title: 'Renting vs. Buying in Addis: Which One is Right for You?',
        excerpt:
          'Choosing between renting or buying a home is a major financial and lifestyle decision, especially in a city like Addis Ababa, where housing demand is rising. While renting offers flexibility, buying a home provides long-term stability and investment value.',
        publishedDate: '2025-07-13',
      },
      {
        title: 'Home Loans in Ethiopia: How to Finance Your Dream Home',
        excerpt:
          'Owning a home is one of the biggest milestones in life, but financing it can feel overwhelming, especially for first-time buyers. Home loans in Ethiopia are becoming more accessible, with banks, microfinance institutions, and developers offering more options.',
        publishedDate: '2025-07-13',
      },
      {
        title: 'Step-by-Step Guide to Buying Your First Home in Ethiopia',
        excerpt:
          "Buying your first home is one of the most exciting and life-changing decisions you'll ever make. In Ethiopia, especially in cities like Addis Ababa, homeownership is becoming increasingly possible, even for middle- and lower-income earners.",
        publishedDate: '2025-07-13',
      },
    ];
    for (const post of posts) {
      const found = await app.documents('api::post.post').findFirst({ filters: { title: post.title } });
      if (!found) {
        await app.documents('api::post.post').create({
          data: {
            ...post,
            slug: slugify(post.title),
            content: `${post.excerpt}\n\n_Full article content to be migrated from the original site._`,
            author: 'admin',
            category: 'Uncategorized',
          },
          status: 'published',
        });
      }
    }
    console.log(`  + posts seeded (${posts.length})`);

    const partners = [{ name: 'Harmony Builders', order: 1 }];
    for (const partner of partners) {
      const found = await app.documents('api::partner.partner').findFirst({ filters: { name: partner.name } });
      if (!found) {
        await app.documents('api::partner.partner').create({ data: { ...partner }, status: 'published' });
      }
    }
    console.log(`  + partners seeded (${partners.length})`);

    console.log('\nSeed complete.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

seed();
