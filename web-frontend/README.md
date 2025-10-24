# PayNext Frontend

The frontend of PayNext is built using React and provides a user interface for users to manage payments, view their profiles, and access dashboards.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/abrar2030/PayNext.git
   cd PayNext/frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Application

To run the application locally, use the following command:

```sh
npm start
# or
yarn start
```

This will start the development server, and you can access the application at `http://localhost:3000`.

### Building the Application

To build the application for production, run:

```sh
npm run build
# or
yarn build
```

The production-ready files will be generated in the `build` folder.

### Folder Structure

- `public/`: Static files such as HTML, manifest, and images.
- `src/`: Contains all the main application files.
    - `components/`: UI components grouped into different feature areas.
    - `services/`: Utility services used for API calls.

### Available Scripts

- `npm test`: Runs the tests.
- `npm run lint`: Lints the code.
- `npm run eject`: Remove the single build dependency from the project.

### Contributing

Contributions are welcome. Please submit a pull request with your changes and ensure they are properly tested.

### License

This project is licensed under the MIT License.
