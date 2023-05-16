import { createContext, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import apiService2 from "../app/apiService2";
import { isValidToken } from "../utils/jwt";

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const INITIALIZE = "AUTH.INITIALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
const LOGOUT = "AUTH.LOGOUT";
const UPDATE_PROFILE = "AUTH.UPDATE_PROFILE";
const UPDATE_SUB = "AUTH.UPDATE_SUB";

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case INITIALIZE:
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isInitialized: true,
        isAuthenticated,
        user,
      };
    case UPDATE_PROFILE:
      const {
        name,
        email,
        cover,
        gender,
        birthday,
        address,
        city,
        country,
        phoneNumber,
        aboutMe,
        facebookLink,
        instagramLink,
        linkedinLink,
        twitterLink,
        lovedStory,
      } = action.payload;

      return {
        ...state,
        user: {
          ...state.user,
          name,
          email,
          gender,
          cover,
          birthday,
          address,
          city,
          country,
          phoneNumber,
          aboutMe,
          facebookLink,
          instagramLink,
          linkedinLink,
          twitterLink,
          lovedStory,
        },
      };
    case UPDATE_SUB:
      const { subscription } = action.payload;
      return {
        ...state,
        user: {
          ...state.user,
          subscription: { isSubscription: true, subscription },
        },
      };
    default:
      return state;
  }
};
const AuthContext = createContext({ ...initialState });

const setsession = (accessToken) => {
  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken);
    apiService2.defaults.headers.common.authorization = `Bearer ${accessToken}`;
  } else {
    window.localStorage.removeItem("accessToken");
    delete apiService2.defaults.headers.common.authorization;
  }
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updatedProfile = useSelector((state) => state.user.updatedProfile);
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        if (accessToken && isValidToken(accessToken)) {
          setsession(accessToken);
          const response = await apiService2.get("/users/me");

          const user = response.data.data;
          const subscriptionResults = await apiService2.get(
            `/subscriptions/${user._id}`
          );

          if (subscriptionResults.data.data.length > 0) {
            user.subscription = {
              isSubscription: true,
              subscription: subscriptionResults.data.data,
            };
          } else {
            user.subscription = {
              isSubscription: false,
            };
          }
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, user },
          });
        } else {
          setsession(null);
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, user: null },
          });
        }
      } catch (error) {
        setsession(null);
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (Object.keys(updatedProfile).length > 0) {
      dispatch({ type: UPDATE_PROFILE, payload: updatedProfile });
    }
  }, [updatedProfile]);

  const login = async ({ email, password }, callback) => {
    const response = await apiService2.post("/auth/login", {
      email,
      password,
    });

    const { user, accessToken } = response.data.data;

    window.localStorage.setItem("username", user.name);

    setsession(accessToken);
    const subscriptionResults = await apiService2.get(
      `/subscriptions/${user._id}`
    );
    if (subscriptionResults.data.data.length > 0) {
      user.subscription = {
        isSubscription: true,
        subscription: subscriptionResults.data.data,
      };
    } else {
      user.subscription = {
        isSubscription: false,
      };
    }
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user },
    });
    callback();
  };

  const logout = async () => {
    setsession(null);
    window.localStorage.removeItem("username");
    dispatch({
      type: LOGOUT,
    });
  };

  const updateSub = async (subscription) => {
    dispatch({
      type: UPDATE_SUB,
      payload: {
        subscription: subscription,
      },
    });
  };

  const register = async ({ name, email, password }, callback) => {
    const respone = await apiService2.post("/users", { name, email, password });
    const { user, accessToken } = respone.data.data;
    setsession(accessToken);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { user },
    });
    callback();
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, updateSub }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
