# ABOUT THE PROJECT
Online Store created with Symfony 6.2 and React.js.

Users (have role ADMIN OR SUPER_ADMIN) can access to admin dashboard and publish products for sale and other admin activities.
Normal users can set their orders ( Online payment - bill in email, email verification ... )

- React router dom to manage Routes in react, using Private and Public routes, Persist user login so the user state didn't lost when visiting another site or when refresh page
- Online payment (Stripe).
- Admin Dashboard.
- Files Upload.
- User Email verification.
- User Roles authorization.
- Products Filter.


## Payment Methods:
    You can edit:
    1 - Checkout payment methods in Config file: www/config/config.js
    2 - Orders pagination items in Admin dashboard in Config file: www/config/config.js