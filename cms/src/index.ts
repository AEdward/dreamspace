import type { Core } from '@strapi/strapi';

const PUBLIC_READ_ACTIONS = [
  'api::unit-type.unit-type.find',
  'api::unit-type.unit-type.findOne',
  'api::office.office.find',
  'api::office.office.findOne',
  'api::partner.partner.find',
  'api::partner.partner.findOne',
  'api::value-prop.value-prop.find',
  'api::value-prop.value-prop.findOne',
  'api::post.post.find',
  'api::post.post.findOne',
  'api::site-setting.site-setting.find',
];

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * Opens read-only public access to the content types the Next.js
   * frontend needs, so the API works without manually clicking through
   * Settings > Users & Permissions > Public on every fresh environment.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    // In Strapi v5 a permission is "enabled" simply by the row existing
    // (action + role) — there's no boolean `enabled` field to flip.
    const existing = await strapi.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id, action: { $in: PUBLIC_READ_ACTIONS } },
    });
    const existingActions = new Set(existing.map((p: { action: string }) => p.action));

    const missing = PUBLIC_READ_ACTIONS.filter((action) => !existingActions.has(action));

    for (const action of missing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  },
};
