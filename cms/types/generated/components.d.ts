import type { Schema, Struct } from '@strapi/strapi';

export interface SharedPhoneNumber extends Struct.ComponentSchema {
  collectionName: 'components_shared_phone_numbers';
  info: {
    displayName: 'Phone Number';
    icon: 'phone';
  };
  attributes: {
    label: Schema.Attribute.String;
    number: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.phone-number': SharedPhoneNumber;
    }
  }
}
