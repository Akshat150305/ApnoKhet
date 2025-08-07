# ApnoKhet
---

## 🔒 Security and Environment Management

This repository contains the source code for the ApnoKhet website. To maintain security and prevent accidental exposure of sensitive data, please adhere to the following rules:

### ⚠️ **Important: Do Not Commit Secrets!**

Under no circumstances should you commit files or code containing sensitive information directly to this repository. This includes, but is not limited to:

* API Keys (e.g., for payment gateways, email services, Google Maps)
* Database credentials (username, password, connection strings)
* Application secret keys (e.g., Django `SECRET_KEY`, JWT secrets)
* `.env` files containing secrets
* Private certificates or keys

### Best Practices

1.  **Use Environment Variables:** All secrets and environment-specific configurations should be loaded from environment variables.
2.  **Use a `.env` file for Local Development:** Create a `.env` file in your local project root to store your keys for development.
3.  **Add `.env` to `.gitignore`:** Ensure that the `.env` file is listed in your `.gitignore` file to prevent it from ever being committed. If it's not there, add this line to your `.gitignore`:
    ```
    # Ignore environment variables file
    .env
    ```
4.  **Create an Example File:** Create a file named `.env.example` or `env.sample` that lists all the required variables without their values. This file *should* be committed to the repository to show other developers what keys they need to set up their own environment.

    *Example `.env.example` file:*
    ```ini
    # Database Configuration
    DB_HOST=localhost
    DB_USER=
    DB_PASSWORD=
    DB_NAME=apnokhet_db

    # Third-Party Services
    EMAIL_HOST_USER=
    EMAIL_HOST_PASSWORD=
    STRIPE_API_KEY=
    ```
