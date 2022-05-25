export const MANAGE_MAPPER_SET_FLOW = "managemapper/SET_FLOW";
export const MANAGE_MAPPER_SET_SELECTED_MENU = "managemapper/SET_SELECTED_MENU";
export const MANAGE_MAPPER_SET_LOADER = "managemapper/SET_LOADER";
export const MANAGE_MAPPER_SET_FULL_PAGE_DATA =
  "managemapper/SET_FULL_PAGE_DATA";
export const MANAGE_MAPPER_SET_TOAST_INFO = "managemapper/SET_TOAST_INFO";
export const MANAGE_MAPPER_SET_PAGE_DATA = "managemapper/SET_PAGE_DATA";
// export const MANAGE_MAPPER_GET_API_RESPONSE =
//   "managemapper/ET_API_RESPONSE";
// export const MANAGE_MAPPER_GET_API_REQUEST =
//   "managemapper/GET_API_REQUEST";
// export const MANAGE_MAPPER_GET_API_ERROR =
//   "managemapper/N_GET_API_ERROR";
// export const MANAGE_MAPPER_POST_API_RESPONSE =
//   "managemapper/ST_API_RESPONSE";
// export const MANAGE_MAPPER_POST_API_ERROR =
//   "managemapper/_POST_API_ERROR";
// export const MANAGE_MAPPER_POST_API_REQUEST =
//   "managemapper/OST_API_REQUEST";

export const setManageMapperSelectedMenu = (payload) => ({
  type: MANAGE_MAPPER_SET_SELECTED_MENU,
  payload,
});

export const setManageMapperFlow = (payload) => ({
  type: MANAGE_MAPPER_SET_FLOW,
  payload,
});

export const setManageMapperLoader = (payload) => ({
  type: MANAGE_MAPPER_SET_LOADER,
  payload,
});

export const setManageMapperFullPageData = (payload) => ({
  type: MANAGE_MAPPER_SET_FULL_PAGE_DATA,
  payload,
});

export const setManageMapperToastInfo = (payload) => ({
  type: MANAGE_MAPPER_SET_TOAST_INFO,
  payload,
});

export const setManageMapperPageLevelData = (payload) => ({
  type: MANAGE_MAPPER_SET_PAGE_DATA,
  payload,
});

// export const getMapperDetailsAction = (payload, dispatch) => {
//   dispatch({
//     type: MANAGE_MAPPER_GET_API_REQUEST,
//   });

//   return getMapperDetails(payload)
//     .then((response) => {
//       dispatch({
//         type: MANAGE_MAPPER_GET_API_RESPONSE,
//         payload: response,
//       });
//       return response;
//     })
//     .catch((error) => {
//       dispatch({
//         type: MANAGE_MAPPER_GET_API_ERROR,
//         payload: error,
//       });
//     });
// };
