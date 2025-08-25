export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const token = context.rootGetters.token;

    const coachData = {
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas
    };

    const response = await fetch(
      `${process.env.VUE_APP_FIREBASE_DB_URL}/coaches/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        body: JSON.stringify(coachData)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to register coach.');
    }

    context.commit('registerCoach', {
      ...coachData,
      id: userId
    });
  },

  async loadCoaches(context, payload) {
  if (!payload.forceRefresh && !context.getters.shouldUpdate) {
    return;
  }

  const response = await fetch(
    `${process.env.VUE_APP_FIREBASE_DB_URL}/coaches.json`
  );
  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(responseData.message || 'Failed to fetch coaches.');
    throw error;
  }

  const coaches = [...context.state.coaches];
  for (const key in responseData) {
    coaches.push({
      id: key,
      ...responseData[key]
    });
  }

  context.commit('setCoaches', coaches);
  context.commit('setFetchTimestamp');
}

};
