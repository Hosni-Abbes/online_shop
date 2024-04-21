
export const StartLogin = (user_credentials) => ({
    type: 'START_LOGIN'
});

export const SuccessLogin = (user) => ({
    type: 'SUCCESS_LOGIN',
    payload: user
});

export const SuccessRegister = () => ({
    type: 'SUCCESS_REGISTER'
});

export const FailLogin = (error) => ({
    type: 'FAIL_LOGIN',
    payload: error
});

export const appLogout = () => ({
    type: "LOGOUT",
  });