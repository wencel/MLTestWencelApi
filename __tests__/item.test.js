const request = require('supertest');
const axios = require('axios');
const app = require('../src/app');
const mockData = require('./fixtures/mockdata.json');

jest.mock('axios');

describe('WHEN trying to get a list of items', () => {
  it('Should get a list of items given a query', async () => {
    const data = mockData.listData;
    axios.get.mockImplementationOnce(() => Promise.resolve({ data }));

    const response = await request(app)
      .get('/api/items?q=se')
      .send()
      .expect(200);

    expectedResponse = {
      author: { name: 'Wencel', lastname: 'Santos' },
      categories: ['MLA438566'],
      items: [
        {
          id: 'MLA880143053',
          title: 'Nintendo Switch 32gb Standard Rojo Neón, Azul Neón Y Negro',
          price: { currency: 'ARS', amount: 75999, decimals: 0 },
          picture:
            'http://http2.mlstatic.com/D_883371-MLA32731749246_112019-I.jpg',
          condition: 'new',
          free_shipping: true,
        },
        {
          id: 'MLA903591629',
          title: 'Nintendo Wii 512mb Standard Blanco',
          price: { currency: 'ARS', amount: 24990, decimals: 0 },
          picture:
            'http://http2.mlstatic.com/D_910960-MLA32731749007_112019-I.jpg',
          condition: 'new',
          free_shipping: true,
        },
        {
          id: 'MLA906664474',
          title: 'Nintendo New 3ds Xl Standard Negro Metálico',
          price: { currency: 'ARS', amount: 49999, decimals: 0 },
          picture:
            'http://http2.mlstatic.com/D_890060-MLA32736005821_112019-I.jpg',
          condition: 'new',
          free_shipping: true,
        },
        {
          id: 'MLA839795990',
          title: 'Nintendo Family Computer Blanco Y Rojo',
          price: { currency: 'ARS', amount: 7400, decimals: 0 },
          picture:
            'http://http2.mlstatic.com/D_857844-MLA32731490398_112019-I.jpg',
          condition: 'new',
          free_shipping: true,
        },
      ],
    };

    expect(JSON.parse(response.text)).toEqual(expectedResponse);
  });

  it('Should get an empty list if no query is given', async () => {
    const response = await request(app).get('/api/items').send().expect(200);

    expectedResponse = {
      author: { name: 'Wencel', lastname: 'Santos' },
      categories: [],
      items: [],
    };
  });

  it('Fails to retrieve data from the ML API', async () => {
    const errorMessage = 'Network Error';

    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    const response = await request(app)
      .get('/api/items?q=se')
      .send()
      .expect(400);
  });
});

describe('WHEN trying to get a list of items', () => {
  it('Should get an item given an ID', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockData.itemData })
    );
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mockData.descriptionData })
    );

    const response = await request(app)
      .get('/api/items/MLA901307677')
      .send()
      .expect(200);

    expectedResponse = {
      author: {
        name: 'Wencel',
        lastname: 'Santos',
      },
      item: {
        id: 'MLA901307677',
        title: 'Celular Tcl 10 Se Icy Silver',
        price: {
          currency: 'ARS',
          amount: 29999,
          decimals: 0,
        },
        picture:
          'http://http2.mlstatic.com/D_690280-MLA44569794262_012021-I.jpg',
        condition: 'new',
        free_shipping: true,
        sold_quantity: 25,
        description:
          'IMPORTANTE: ¿Hacen factura A? Para que podamos emitir la factura A, necesitamos que la cuenta de Mercado Libre desde donde vayas a realizar la compra, esté registrada como IVA Responsable Inscripto o IVA Exento. De lo contrario, se va a emitir automáticamente una factura B. Podrás actualizar esta información desde la sección "Mis datos". \n\nSmartphone liberado con pantalla 20:9 V-notch HD+ de 6.5” (720x1600p) con tecnología NXTVISION, Procesador Octa Core, Android 10, Triple Cámara Principal 48+5+2mpx con dual LED flash - Frontal 13mpx/flash, Memoria interna 128 GB, memoria RAM 4 GB, Batería 4000mAh. Desbloqueo por huella y reconocimiento facial. Botón de acceso directo a Google Assistant. Incluye funda protectora.',
      },
    };

    expect(JSON.parse(response.text)).toEqual(expectedResponse);
  });

  it('Fails to retrieve data from the ML API item call', async () => {
    const errorMessage = 'Network Error';

    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    const response = await request(app)
      .get('/api/items/MLA901307677')
      .send()
      .expect(400);
    expect(response.body.error).toEqual(`Error: ${errorMessage}`);
  });
});
