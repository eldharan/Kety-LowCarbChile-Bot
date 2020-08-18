# Kety-LowCarbChile-Bot

Programming code in Google Apps Scripts (GAS) for **Kety**, the [Telegram Bot](https://t.me/lowcarbchilebot) of **[Low Carb Chile](https://www.lowcarbchile.com)** foundation and community.

Kety is an interactive virtual assistant to help you with frequently asked questions and search information about keto and low carb within Telegram chats and groups, for now it only does inline searches suggesting web articles, YouTube videos, Instagram posts and documents or images inside Telegram.
Also Kety performs some maintenance in Telegram groups, like opening and closing them at specific hours and sending useful messages.

It started using a Google Spreadsheet as searching library but we reached a timeout limitation for Telegram Bot API and the queries were super slow, so we decided to use a JSON file in Google Drive instead.


## Files description:

- ***[Config.gs](Config.gs)*** Private configuration file for settings and keys, the values must be changed for your own.
- ***[Setup.gs](Setup.gs)*** WebApp basic functions and webhook initial configuration.
- ***[Tasks.gs](Tasks.gs)*** Scheduled tasks and maintenance for groups in Telegram.
- ***[TelegramBot.gs](TelegramBot.gs)*** Main script for bot interactions, with specific sections: generic, files, inline queries and private chat.


### Deployment on Google Script, do this every time you want to publish changes:

1. Save changes to all files.
2. Publish as Web App with a **new** version.
3. Copy the new Web App URL in [Config.gs](Config.gs).
4. Run _setWebhook()_ function from [Setup.gs](Setup.gs).
5. Test for applied changes on Telegram.


## Details of parameters used in JSON file for inline searches:

This is based on Telegram Bot API [InlineQueryResult](https://core.telegram.org/bots/api#inlinequeryresult) types and required keys, which is serialized in [TelegramBot.gs](TelegramBot.gs).

| Key | Type | Description |
| --- | --- | --- |
| `id` | String | Unique identifier for each object. |
| `type` | String | Some types of Telegram InlineQueryResult. _document, article, photo_. |
| `source` | String | Source of the object. _web, text, instagram, youtube, telegram_. |
| `title` | String | Title displayed on suggestions. |
| `description` | String | Description displayed on suggestions. |
| `keywords` | String | **Normalized** keywords to make it easier to search objects. |
| `input_date` | String | Date and time when this object was saved. _Automatic._ |
| `input_user` | String | Telegram _id_ of the user who saved this object. _Automatic._ |
| `url` | String | Telegram _file_id_ or URL of the article, post or video. |
| `thumb_url` | String | URL of the thumbnail image, displayed on suggestions. _Empty only when source is telegram_. |
| `photo_width` | Number | Width of the original image. _Required only when type is photo and source is web_. |
| `photo_height` | Number | Height of the original image. _Required only when type is photo and source is web_. |


### Example of JSON file:

```json
[
  {
    "id": "1",
    "type": "document",
    "source": "telegram",
    "title": "Instrucciones para novatos en Low Carb Chile",
    "description": "Documento de Telegram",
    "keywords": "instrucciones para novatos en low carb chile ingresos directriz directrices reglas principiantes",
    "input_date": "2020-04-23 3:34:07",
    "input_user": "760955310",
    "url": "BQACAgEAAxkBAAIBDl6nXeoetP9_zIGan-trb9ihvg0xAAJIAQAC74ZBRX9dgxJs-sUEGQQ",
    "thumb_url": ""
  },
  {
    "id": "2",
    "type": "article",
    "source": "instagram",
    "title": "Proporciones de tus platos",
    "description": "IG post @lowcarbchileoficial",
    "keywords": "proporciones de tus platos ... cena almuerzo desayuno grasas proteinas plantas verduras",
    "input_date": "2020-04-23 3:34:07",
    "input_user": "760955310",
    "url": "https://www.instagram.com/p/B7UgQRCH0Hu/",
    "thumb_url": "https://instagram.fscl14-1.fna.fbcdn.net/v/t51.2885-15/e35/s150x150/81908314_1747571405367386_5259296594522926485_n.jpg?_nc_ht=instagram.fscl14-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=CNXVvETCXLEAX-E8N6g&oh=ab502f7109ead53b6c934df1015afc9f&oe=5ECB4AE1"
  },
  {
    "id": "3",
    "type": "article",
    "source": "web",
    "title": "Keto breve y fácil",
    "description": "Entrada de web lowcarbchile.com",
    "keywords": "keto breve y facil esta es una explicacion lo mas resumida y simple posible sobre keto  come menos de 30g de carbohidratos al dia (netos) ... te recomendamos seguir la cuenta de nuestro amigo manoso entrada post web blog",
    "input_date": "2020-04-23 3:34:07",
    "input_user": "760955310",
    "url": "https://www.lowcarbchile.com/2019/10/18/keto-breve-y-facil/",
    "thumb_url": "https://www.lowcarbchile.com/wp-content/uploads/2019/10/Bacon.jpg"
  },
  {
    "id": "4",
    "type": "article",
    "source": "youtube",
    "title": "Dr. Cywes: La fibra no es esencial ni necesaria",
    "description": "Video en Youtube LowCarbChile",
    "keywords": "dr. cywes: la fibra no es esencial ni necesaria traducimos el video del dr robert cywes sobre la fibra, el nos explica que no es esencial ni necesaria para tener buenas deposiciones, es mas, mientras mas carnivoros seamos mejor y mas suave seran nuestras evacuaciones, lo necesario son grasas saturadas, abundante sal y agua.  tal como menciona zoe harcombe la evidencia que la fibra es necesaria para los seres humanos carece de ciencia en nutricion.  #fibra #diverticulitis #carbaddictiondoc #keto #carnivore #fiber #poop #salud #nutricion #keto #lchf #lowcarbchile canal youtube",
    "input_date": "2020-04-23 3:34:07",
    "input_user": "760955310",
    "url": "https://www.youtube.com/watch?v=FBgxX2nsY4A",
    "thumb_url": "https://img.youtube.com/vi/FBgxX2nsY4A/hqdefault.jpg"
  },
  {
    "id": "5",
    "type": "photo",
    "source": "web",
    "title": "Tazones fundación",
    "description": "Imagen de web LowCarbChile",
    "keywords": "tazones imagen fundacion",
    "input_date": "2020-04-23 3:34:07",
    "input_user": "760955310",
    "url": "https://www.lowcarbchile.com/wp-content/uploads/2020/04/photo_2020-04-10_14-42-51.jpg",
    "thumb_url": "https://www.lowcarbchile.com/wp-content/uploads/2020/04/photo_2020-04-10_14-42-51.jpg",
    "photo_width": 960,
    "photo_height": 540
  },
  {
    "id": "6",
    "type": "photo",
    "source": "telegram",
    "title": "Proporciones de tus platos",
    "description": "Imagen de Telegram",
    "keywords": "proporciones de tus platos ... cena almuerzo desayuno grasas proteinas plantas verduras",
    "input_date": "2020-04-23 3:34:07",
    "input_user": "760955310",
    "url": "AgACAgEAAxkBAAOYXqDcllgPDTSIwj3hQt6F8djaLKQAAg-pMRvQwghFyyC3WBmG1YdU4GsGAAQBAAMCAAN5AAP2hAMAARgE",
    "thumb_url": ""
  },
]
```

