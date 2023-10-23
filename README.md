# Neatreads

This project is built with Next.js 13, utilizing app router with route handlers & dynamic routes & SSR, and Google API.

### 🚀 Features

- 🌟 **Reviews and Ratings**

- 📚 **Reading status**

- 🏆 **Reading goals**

- 🗂 **Collections**

- 🤵 **User Profiles**
  
- 👥 **Follows**

- 🔎 **Search** (querying users and books at once)

## Local setup

### Prerequisites

- Ensure you have Docker installed and running in the background.

### Setup Instructions

1. Checkout to the "local" branch:

    ```bash
    git checkout local
    ```

2. Install project dependencies:

    ```bash
    pnpm i
    ```

3. Start Supabase:

    ```bash
    supabase start
    ```

4. Run the project in preview mode:

    ```bash
    pnpm run preview
    ```
    
4. Access the application locally at [http://localhost:3000](http://localhost:3000). (default)*

### Local Email Testing

When testing locally, emails won't be sent to your address. You have to access inbucket at:

[http://localhost:54324](http://localhost:54324) (default)*

### Disclaimer *

*Please note that ports may vary, check output of ``supabase start`` to know for sure.*

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).
