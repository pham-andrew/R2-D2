exports.seed = function (knex) {

  return knex("routes")
    .del()
    .then(function () {
      return knex("routes").insert([
        {
          name: "Engineering Review Board",
          group_id: 7
        },
        {
          name: "Configuration Control Board",
          group_id: 7
        },
        {
          name: "Awards Package",
          group_id: 2
        },
      ]);
    });
};
