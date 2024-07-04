import axios from './axiosCustomize';

const postGetAvailableHotel = (province, checkinDate, checkoutDate, ratingStarts, numberOfPeople, numberOfRooms, acceptChildren, acceptPet, supportPeopleWithDisabilitie, haveEvelator, haveSwimmingPool) => {
  const data = new FormData();
  data.append('province', province);
  data.append('checkinDate', checkinDate.toISOString());  // Convert DateTime to ISO string
  data.append('checkoutDate', checkoutDate.toISOString());  // Convert DateTime to ISO string
  if (ratingStarts) {
    ratingStarts.forEach(start => {
      data.append('ratingStarts', start.toString());
    });
  }
  if (numberOfPeople) {
    data.append('numberOfPeople', numberOfPeople.toString());
  }
  if (numberOfRooms) {
    data.append('numberOfRooms', numberOfRooms.toString());
  }
  if (acceptChildren !== null && acceptChildren !== undefined) {
    data.append('acceptChildren', acceptChildren.toString());
  }
  if (acceptPet !== null && acceptPet !== undefined) {
    data.append('acceptPet', acceptPet.toString());
  }
  if (supportPeopleWithDisabilitie !== null && supportPeopleWithDisabilitie !== undefined) {
    data.append('supportPeopleWithDisabilitie', supportPeopleWithDisabilitie.toString());
  }
  if (haveEvelator !== null && haveEvelator !== undefined) {
    data.append('haveEvelator', haveEvelator.toString());
  }
  if (haveSwimmingPool !== null && haveSwimmingPool !== undefined) {
    data.append('haveSwimmingPool', haveSwimmingPool.toString());
  }

  return axios.post('api/v1/getavailablhotel', data);
};

export default postGetAvailableHotel;