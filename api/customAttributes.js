const axios = require("axios");
const yn = require("yn");
const {CANON_API, CANON_CMS_CUBES} = process.env;
const verbose = yn(process.env.CANON_CMS_LOGGING);
const BASE_API = `${CANON_CMS_CUBES}data.jsonrecords`;

const catcher = error => {
  if (verbose) console.error("Custom Attribute Error:", error);
  return [];
};
module.exports = function(app) {

  app.post("/api/cms/customAttributes/:pid", async(req, res) => {
    const pid = req.params.pid * 1;
    const {cache} = app.settings;
    const {variables, locale} = req.body;
    const {
      id1,
      dimension1,
      hierarchy1,
      slug1,
      name1,
      cubeName1,
      parents1
    } = variables;

    // ENOE: Shared customAttribute
    const ENOE_DATASET = async(hierarchy, id) => {
      const params = {
        cube: "inegi_enoe",
        drilldowns: "Quarter",
        measures: "Workforce",
        [hierarchy]: id
      };
      const data = await axios
        .get(BASE_API, {params})
        .then(resp => resp.data.data)
        .catch(catcher);

      data.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
      const enoeLatestQuarter = data[0] ? data[0]["Quarter ID"] : undefined;
      const enoePrevQuarter = data[1] ? data[1]["Quarter ID"] : undefined;
      const enoePrevYear = data[4] ? data[4]["Quarter ID"] : undefined;
      return {enoeLatestQuarter, enoePrevQuarter, enoePrevYear};
    };


    // Foreign Trade: Shared customAttribute
    const FOREIGN_DATASET = async(hierarchy, id) => {

      const params = {
        cube: "economy_foreign_trade_ent",
        drilldowns: "Month",
        measures: "Trade Value",
        [hierarchy]: id,
        parents: true
      };
      const data = await axios
        .get(BASE_API, {params})
        .then(resp => resp.data.data)
        .catch(catcher);

      data.sort((a, b) => b["Month ID"] - a["Month ID"]);

      const yearsInData = [...new Set(data.map(m => m.Year))];
      yearsInData.sort((a, b) => b - a);

      const quartersInData = [...new Set(data.map(m => m["Quarter ID"]))];
      quartersInData.sort((a, b) => b - a);

      let tradeLatestYear = undefined;
      let tradeLatestQuarter = undefined;

      for (const year of yearsInData) {
        const quetersPerYear = data.filter(d => d.Year === year).length;
        if (quetersPerYear === 12 && !tradeLatestYear) tradeLatestYear = year;
      }

      for (const quarter of quartersInData) {
        const quartersPerYear = data.filter(d => d["Quarter ID"] === quarter).length;
        if (quartersPerYear === 3 && !tradeLatestQuarter) tradeLatestQuarter = quarter;
      }

      const foreignTradeLatestYear = tradeLatestYear;
      const foreignTradePrevYear = tradeLatestYear - 1;
      const foreignTradeLatestQuarter = tradeLatestQuarter;
      const foreignTradeLatestMonth = data[0] ? data[0]["Month ID"] : undefined;

      return {foreignTradeLatestMonth, foreignTradeLatestQuarter, foreignTradeLatestYear, foreignTradePrevYear};
    };

    // Creates empty variables.
    let enoeLatestQuarter, enoePrevQuarter, enoePrevYear, foreignTradeLatestMonth, foreignTradeLatestQuarter, foreignTradeLatestYear, foreignTradePrevYear;

    // Verifies profile.
    switch (pid) {
      // Geo profile
      case 1:
        let customId = id1;
        let customName = name1;
        const isMunicipality = ["Municipality"].includes(hierarchy1);
        const isState = ["Nation", "State"].includes(hierarchy1);

        if (isMunicipality) {
          const allData = cache.geoData;
          const parent = allData[id1];
          if (parent) {
            customId = parent["State ID"];
            customName = parent.State;
          }
        }

        const customHierarchy = isMunicipality ? "State" : hierarchy1;

        const ENOE_GEO = await ENOE_DATASET(customHierarchy, customId).catch(
          () => { }
        );
        enoeLatestQuarter = ENOE_GEO.enoeLatestQuarter;
        enoePrevQuarter = ENOE_GEO.enoePrevQuarter;
        enoePrevYear = ENOE_GEO.enoePrevYear;

        const FOREIGN_GEO = await FOREIGN_DATASET(hierarchy1, id1).catch(
          () => { }
        );
        foreignTradeLatestMonth = FOREIGN_GEO.foreignTradeLatestMonth;
        foreignTradeLatestYear = FOREIGN_GEO.foreignTradeLatestYear;
        foreignTradePrevYear = FOREIGN_GEO.foreignTradePrevYear;

        // FDI temporal customAttributes at geo level
        const fdiGeo = {
          cube: "fdi_2_state_investment",
          drilldowns: "Quarter",
          measures: "Investment",
          parents: true
        };

        const fdiGeoValues = await axios
          .get(BASE_API, {params: fdiGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        fdiGeoValues.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const fdiLatestQuarter = fdiGeoValues[0] ? fdiGeoValues[0]["Quarter ID"] : undefined;

        // GDP latest quarter customAttributes
        const gdpGeo = {
          cube: "inegi_gdp",
          drilldowns: "Quarter",
          measures: "GDP"
        };

        const gdpValues = await axios
          .get(BASE_API, {params: gdpGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        gdpValues.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const gdpLatestQuarter = gdpValues[0] ? gdpValues[0]["Quarter ID"] : undefined;

        // INEA temporal customAttributes
        const ineaGeo = {
          cube: "inea_adult_education_stats",
          drilldowns: "Quarter",
          measures: "Active advisors"
        };

        const ineaGeoValues = await axios
          .get(BASE_API, {params: ineaGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        ineaGeoValues.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const ineaLatestQuarter = ineaGeoValues[0] ? ineaGeoValues[0]["Quarter ID"] : undefined;
        const ineaPrevYearQuarter = ineaGeoValues[4] ? ineaGeoValues[4]["Quarter ID"] : undefined;

        // Infonavit latest month (infonavit_entity_credits)
        const infonavitEntities = {
          cube: "infonavit_entity_credits",
          drilldowns: "Month",
          measures: "Number of Credits"
        };

        const infonavitEntitiesValues = await axios
          .get(BASE_API, {params: infonavitEntities})
          .then(resp => resp.data.data)
          .catch(catcher);
        infonavitEntitiesValues.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const infonavitEntitiesMonth = infonavitEntitiesValues[0] ? infonavitEntitiesValues[0]["Month ID"] : undefined;

        // Infonavit latest month (infonavit_product_credits)
        const infonavitProducts = {
          cube: "infonavit_product_credits",
          drilldowns: "Month",
          measures: "Number of Credits"
        };

        const infonavitProductValues = await axios
          .get(BASE_API, {params: infonavitProducts})
          .then(resp => resp.data.data)
          .catch(catcher);
        infonavitProductValues.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const infonavitProductMonth = infonavitProductValues[0] ? infonavitProductValues[0]["Month ID"] : undefined;

        // Infonavit latest bimester (infonavit_payment_entity_credits)
        const infonavitPatron = {
          cube: "infonavit_payment_entity_credits",
          drilldowns: "Year-Bimester",
          measures: "Number of companies"
        };

        const infonavitPatronValues = await axios
          .get(BASE_API, {params: infonavitPatron})
          .then(resp => resp.data.data)
          .catch(catcher);
        infonavitPatronValues.sort((a, b) => b["Year-Bimester"] - a["Year-Bimester"]);
        const infonavitPatronBimester = infonavitPatronValues[0] ? infonavitPatronValues[0]["Year-Bimester"] : undefined;
        const infonavitPatronPrevBimester = infonavitPatronValues[1] ? infonavitPatronValues[1]["Year-Bimester"] : undefined;
        const infonavitPatronPrevYearBimester = infonavitPatronValues[6] ? infonavitPatronValues[6]["Year-Bimester"] : undefined;

        // Sesnsp_crimes temporal customAttributes
        const sesnspGeo = {
          cube: "sesnsp_crimes",
          drilldowns: "Month",
          measures: "Value"
        };

        const sesnsp_crimes = await axios
          .get(BASE_API, {params: sesnspGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        sesnsp_crimes.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const crimesLatestMonth = sesnsp_crimes[0] ? sesnsp_crimes[0]["Month ID"] : undefined;
        const crimesPrevYearMonth = sesnsp_crimes[12] ? sesnsp_crimes[12]["Month ID"] : undefined;

        // Insurers last month
        const insurersGeo = {
          cube: "insurers",
          drilldowns: "Egress Month",
          measures: "Patient Count by State"
        };

        const insurersMonth = await axios
          .get(BASE_API, {params: insurersGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        insurersMonth.sort((a, b) => b["Egress Month ID"] - a["Egress Month ID"]);
        const insurersLatestMonth = insurersMonth[0] ? insurersMonth[0]["Egress Month ID"] : undefined;

        // Banxico foreign trade last month
        const banxicoForeignTradeGeo = {
          cube: "banxico_trade_flow",
          drilldowns: "Month",
          measures: "Trade Value"
        };

        const banxicoForeignTradeMonth = await axios
          .get(BASE_API, {params: banxicoForeignTradeGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        banxicoForeignTradeMonth.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const banxicoForeignTradeLastMonth = banxicoForeignTradeMonth[0] ? banxicoForeignTradeMonth[0]["Month ID"] : undefined;

        // Inegi foreign trade last month
        const inegiForeignTradeGeo = {
          cube: "inegi_foreign_trade_country",
          drilldowns: "Month",
          measures: "Trade Value"
        };

        const inegiForeignTradeMonth = await axios
          .get(BASE_API, {params: inegiForeignTradeGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        inegiForeignTradeMonth.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const inegiForeignTradeLastMonth = inegiForeignTradeMonth[0] ? inegiForeignTradeMonth[0]["Month ID"] : undefined;

        // Gini customAttributes
        const customGiniCube =
          hierarchy1 === "Nation"
            ? "coneval_gini_nat"
            : hierarchy1 === "State"
              ? "coneval_gini_ent"
              : "coneval_gini_mun";

        // Foreign Trade Cube customAttributes
        const customForeignTradeCube =
        hierarchy1 === "Nation"
          ? "economy_foreign_trade_nat"
          : hierarchy1 === "State"
            ? "economy_foreign_trade_ent"
            : "economy_foreign_trade_mun";

        // Remittances Income
        const remittanceDataGeo = {
          cube: "banxico_income_remittances",
          drilldowns: "Month",
          measures: "Remittance Amount",
          parents: true,
          [hierarchy1]: id1
        };

        const remmitancesGeo = await axios
          .get(BASE_API, {params: remittanceDataGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        remmitancesGeo.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const remmitanceLastMonthGeo = remmitancesGeo[0] ? remmitancesGeo[0]["Month ID"] : undefined;

        // Remittances Countries
        const remittanceQuarterGeo = {
          cube: "banxico_countries_remittances",
          drilldowns: "Quarter",
          measures: "Remittance Amount",
          parents: true,
          [hierarchy1]: id1
        };

        const remmitancesGeoQuarter = await axios
          .get(BASE_API, {params: remittanceQuarterGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        remmitancesGeoQuarter.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const remmitanceLastQuarterGeo = remmitancesGeoQuarter[0] ? remmitancesGeoQuarter[0]["Quarter ID"] : undefined;
        const remmitanceLastYearGeo = remmitancesGeoQuarter[0] ? remmitancesGeoQuarter[0].Year : undefined;

        return res.json({
          canonApi: CANON_API,
          customCovidCube:
            hierarchy1 === "State"
              ? "gobmx_covid_stats_state"
              : hierarchy1 === "Nation"
                ? "gobmx_covid_stats_nation"
                : "gobmx_covid_stats_mun",

          customSocialLagCube: `coneval_social_lag_${isState ? "ent" : "mun"}`,
          customGiniCube,
          customForeignTradeCube, // : isState ? "economy_foreign_trade_ent" : "economy_foreign_trade_mun",
          customHierarchy,
          customId,
          customName,
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear,
          fdiLatestQuarter,
          foreignTradeLatestMonth,
          foreignTradeLatestYear,
          foreignTradePrevYear,
          banxicoForeignTradeLastMonth,
          inegiForeignTradeLastMonth,
          ineaLatestQuarter,
          ineaPrevYearQuarter,
          crimesLatestMonth,
          crimesPrevYearMonth,
          infonavitEntitiesMonth,
          infonavitPatronBimester,
          infonavitPatronPrevBimester,
          infonavitPatronPrevYearBimester,
          infonavitProductMonth,
          insurersLatestMonth,
          gdpLatestQuarter,
          remmitanceLastMonthGeo,
          remmitanceLastQuarterGeo,
          remmitanceLastYearGeo
        });

      // Product profile
      case 11:
        const customLevel = hierarchy1 === "Chapter" ? 2 : hierarchy1.slice(2, 3) * 1;
        const customHS = hierarchy1 === "HS6" ? "HS6" : `${hierarchy1}+${customLevel}+Digit`;

        // Month value from nation cube
        const foreignTradeNatData = {
          cube: "economy_foreign_trade_nat",
          drilldowns: "Month",
          measures: "Trade Value",
          [hierarchy1]: id1,
          parents: false
        };
        const foreignTradeNat = await axios
          .get(BASE_API, {params: foreignTradeNatData})
          .then(resp => resp.data.data)
          .catch(catcher);
        foreignTradeNat.sort((a, b) => b["Month ID"] - a["Month ID"]);

        const lastMonthNat = foreignTradeNat[0] ? foreignTradeNat[0]["Month ID"] : undefined;

        // Year value from nation cube
        const foreignTradeNationData = {
          cube: "economy_foreign_trade_nat",
          drilldowns: "Date Year",
          measures: "Trade Value",
          [hierarchy1]: id1,
          parents: false
        };
        const foreignTradeYear = await axios
          .get(BASE_API, {params: foreignTradeNationData})
          .then(resp => resp.data.data)
          .catch(catcher);
        foreignTradeYear.sort((a, b) => b["Date Year"] - a["Date Year"]);

        const lastYearNat = foreignTradeYear[0] ? foreignTradeYear[0]["Date Year"] : undefined;

        // Quarter value from state cube
        const foreignTradeEntData = {
          cube: "economy_foreign_trade_ent",
          drilldowns: "Quarter",
          measures: "Trade Value",
          [hierarchy1]: id1,
          parents: false
        };
        const foreignTradeEnt = await axios
          .get(BASE_API, {params: foreignTradeEntData})
          .then(resp => resp.data.data)
          .catch(catcher);
        foreignTradeEnt.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);

        const lastQuarterEnt = foreignTradeEnt[0] ? foreignTradeEnt[0]["Quarter ID"] : undefined;

        // Year value from state cube
        const foreignTradeStateData = {
          cube: "economy_foreign_trade_ent",
          drilldowns: "Date Year",
          measures: "Trade Value",
          [hierarchy1]: id1,
          parents: false
        };
        const foreignTradeEntYear = await axios
          .get(BASE_API, {params: foreignTradeStateData})
          .then(resp => resp.data.data)
          .catch(catcher);
        foreignTradeEntYear.sort((a, b) => b["Date Year"] - a["Date Year"]);

        const lastYearEnt = foreignTradeEntYear[0] ? foreignTradeEntYear[0]["Date Year"] : undefined;

        // INEGI Month
        const inegiProductData = {
          cube: "inegi_foreign_trade_product",
          drilldowns: "Month",
          measures: "Trade Value",
          [hierarchy1]: id1
        };
        const inegiProduct = await axios
          .get(BASE_API, {params: inegiProductData})
          .then(resp => resp.data.data)
          .catch(catcher);
        inegiProduct.sort((a, b) => b["Month ID"] - a["Month ID"]);

        const inegiMonth = inegiProduct[0] ? inegiProduct[0]["Month ID"] : undefined;

        // BACI Year
        const baciData = {
          cube: "trade_i_baci_a_12",
          drilldowns: "Year",
          measures: "Trade Value",
          [hierarchy1]: id1
        };
        const baci = await axios
          .get(BASE_API, {params: baciData})
          .then(resp => resp.data.data)
          .catch(catcher);
        baci.sort((a, b) => b.Year - a.Year);

        const baciYear = baci[0] ? baci[0].Year : undefined;

        return res.json({
          canonApi: CANON_API,
          customLevel,
          customHS,
          lastYearNat,
          lastMonthNat,
          lastYearEnt,
          lastQuarterEnt,
          inegiMonth,
          baciYear
        });

      // Institution profile
      case 22:
        const anuiesParams = {
          cube: "anuies_enrollment",
          drilldowns: "Year",
          measures: "Students",
          [hierarchy1]: id1
        };
        const anuiesUpdated = await axios
          .get(BASE_API, {params: anuiesParams})
          .then(resp => resp.data.data)
          .catch(catcher);
        anuiesUpdated.sort((a, b) => b.Year - a.Year);

        const anuiesLatestYear = anuiesUpdated[0] ? anuiesUpdated[0].Year : undefined;
        const anuiesPrevYear = anuiesUpdated[1] ? anuiesUpdated[1].Year : undefined;


        return res.json({
          anuiesLatestYear,
          anuiesPrevYear,
          canonApi: CANON_API
        });

      // Occupation profile
      case 28:
        const ENOE_OCCUPATION = await ENOE_DATASET(hierarchy1, id1).catch(
          () => { }
        );
        enoeLatestQuarter = ENOE_OCCUPATION.enoeLatestQuarter;
        enoePrevQuarter = ENOE_OCCUPATION.enoePrevQuarter;
        enoePrevYear = ENOE_OCCUPATION.enoePrevYear;

        return res.json({
          canonApi: CANON_API,
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear
        });

      // Country profile
      case 46:

        // Foreign Trade Month
        const FOREIGN_COUNTRY = await FOREIGN_DATASET(hierarchy1, id1).catch(
          () => { }
        );
        foreignTradeLatestMonth = FOREIGN_COUNTRY.foreignTradeLatestMonth;

        // Foreign Trade Year
        const foreignYearData = {
          cube: "economy_foreign_trade_ent",
          drilldowns: "Date Year",
          measures: "Trade Value",
          parents: false,
          [hierarchy1]: id1
        };

        const foreignYear = await axios
          .get(BASE_API, {params: foreignYearData})
          .then(resp => resp.data.data)
          .catch(catcher);
        foreignYear.sort((a, b) => b["Date Year"] - a["Date Year"]);
        const foreignTradeLastYearCountry = foreignYear[0] ? foreignYear[0]["Date Year"] : undefined;

        // FDI Last Year
        const fdiCountryData = {
          cube: "fdi_10_year_country",
          drilldowns: "Year",
          measures: "Investment",
          parents: false,
          [hierarchy1]: id1
        };

        const fdiCountry = await axios
          .get(BASE_API, {params: fdiCountryData})
          .then(resp => resp.data.data)
          .catch(catcher);
        fdiCountry.sort((a, b) => b.Year - a.Year);
        const fdiLastYear = fdiCountry[0] ? fdiCountry[0].Year : undefined;

        // FDI Last Quarter
        const fdiQuarterData = {
          cube: "fdi_9_quarter",
          drilldowns: "Quarter",
          measures: "Investment",
          parents: false,
          [hierarchy1]: id1
        };

        const fdiQuarter = await axios
          .get(BASE_API, {params: fdiQuarterData})
          .then(resp => resp.data.data)
          .catch(catcher);
        fdiQuarter.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const fdiLastQuarter = fdiQuarter[0] ? fdiQuarter[0]["Quarter ID"] : undefined;

        // Banxico
        const banxicoData = {
          cube: "banxico_trade_flow",
          drilldowns: "Month",
          measures: "Trade Value",
          parents: false,
          [hierarchy1]: id1
        };

        const banxico = await axios
          .get(BASE_API, {params: banxicoData})
          .then(resp => resp.data.data)
          .catch(catcher);
        banxico.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const banxicoLastMonth = banxico[0] ? banxico[0]["Month ID"] : undefined;

        // Inegi foreign trade
        const inegiForeignTradeData = {
          cube: "inegi_foreign_trade_country",
          drilldowns: "Month",
          measures: "Trade Value",
          parents: false,
          [hierarchy1]: id1
        };

        const inegiForeignTrade = await axios
          .get(BASE_API, {params: inegiForeignTradeData})
          .then(resp => resp.data.data)
          .catch(catcher);
        inegiForeignTrade.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const inegiLastMonth = inegiForeignTrade[0] ? inegiForeignTrade[0]["Month ID"] : undefined;

        // Remittances
        const remittanceData = {
          cube: "banxico_countries_remittances",
          drilldowns: "Quarter",
          measures: "Remittance Amount",
          parents: true,
          [hierarchy1]: id1
        };

        const remmitances = await axios
          .get(BASE_API, {params: remittanceData})
          .then(resp => resp.data.data)
          .catch(catcher);
        remmitances.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const remmitanceLastQuarter = remmitances[0] ? remmitances[0]["Quarter ID"] : undefined;
        const remmitanceLastYear = remmitances[0] ? remmitances[0].Year : undefined;


        return res.json({
          canonApi: CANON_API,
          foreignTradeLastYearCountry,
          foreignTradeLatestMonth,
          fdiLastYear,
          fdiLastQuarter,
          banxicoLastMonth,
          inegiLastMonth,
          remmitanceLastQuarter,
          remmitanceLastYear
        });

      // Complexity profile
      case 47:
        // BACI
        const baciParams = {
          cube: "trade_i_baci_a_12",
          drilldowns: "Year",
          measures: "Trade Value"
        };
        const baciUpdated = await axios
          .get(BASE_API, {params: baciParams})
          .then(resp => resp.data.data)
          .catch(catcher);
        baciUpdated.sort((a, b) => b.Year - a.Year);

        const baciLastYear = baciUpdated[0] ? baciUpdated[0].Year : undefined;
        const baciPrevYear = baciLastYear ? baciLastYear - 7  : undefined;

        // ECI
        const eciParams = {
          cube: "complexity_eci",
          drilldowns: "Date",
          measures: "ECI"
        };
        const eciUpdated = await axios
          .get(BASE_API, {params: eciParams})
          .then(resp => resp.data.data)
          .catch(catcher);
        eciUpdated.sort((a, b) => b["Date ID"] - a["Date ID"]);

        const eciLastDate = eciUpdated[0] ? eciUpdated[0].Date : undefined;

        // PCI
        const pciParams = {
          cube: "complexity_eci",
          drilldowns: "Date",
          measures: "ECI"
        };
        const pciUpdated = await axios
          .get(BASE_API, {params: pciParams})
          .then(resp => resp.data.data)
          .catch(catcher);
        pciUpdated.sort((a, b) => b["Date ID"] - a["Date ID"]);

        const pciLastDate = pciUpdated[0] ? pciUpdated[0].Date : undefined;

        return res.json({
          canonApi: CANON_API,
          baciLastYear,
          baciPrevYear,
          eciLastDate,
          pciLastDate
        });

      // Industry profile
      case 33:
        // Economic Census
        const censusParams = {
          cube: "inegi_economic_census",
          drilldowns: "National Industry",
          measures: "Economic Unit",
          parents: "true",
          locale,
          [hierarchy1]: id1
        };
        const censusIdSector = await axios
          .get(BASE_API, {params: censusParams})
          .then(resp => resp.data.data)
          .catch(catcher);

        const sectorId = censusIdSector[0]["Sector ID"];
        const sectorName = censusIdSector[0].Sector;

        // ENOE
        const ENOE_INDUSTRY = await ENOE_DATASET(hierarchy1, id1).catch(
          () => { }
        );

        enoeLatestQuarter = ENOE_INDUSTRY.enoeLatestQuarter;
        enoePrevQuarter = ENOE_INDUSTRY.enoePrevQuarter;
        enoePrevYear = ENOE_INDUSTRY.enoePrevYear;
        const isDeepestLevel = ["NAICS Industry", "National Industry"].includes(
          hierarchy1
        );

        // FDI temporal customAttributes
        const fdiIndustry = {
          cube: "fdi_quarter_industry",
          drilldowns: "Quarter",
          measures: "Investment",
          parents: true
        };
        const fdiIndustryValues = await axios
          .get(BASE_API, {params: fdiIndustry})
          .then(resp => resp.data.data)
          .catch(catcher);
        fdiIndustryValues.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const fdiLatestQuarterIndustry = fdiIndustryValues[0] ? fdiIndustryValues[0]["Quarter ID"] : undefined;

        /* const fdiLatestYearIndustry = fdiIndustryValues[0] ? fdiIndustryValues[0].Year : undefined;
        const fdiPrevQuarterIndustry = fdiIndustryValues[1] ? fdiIndustryValues[1]["Quarter ID"] : undefined;
        const fdiPrevQuarterYearIndustry = fdiIndustryValues[4] ? fdiIndustryValues[4]["Quarter ID"] : undefined;
        */

        // GDP latest quarter customAttributes
        const gdpIndustry = {
          cube: "inegi_gdp",
          drilldowns: "Quarter",
          measures: "GDP"
        };

        const gdpValuesIndustry = await axios
          .get(BASE_API, {params: gdpIndustry})
          .then(resp => resp.data.data)
          .catch(catcher);
        gdpValuesIndustry.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const gdpLatestQuarterSector = gdpValuesIndustry[0] ? gdpValuesIndustry[0]["Quarter ID"] : undefined;
        const gdpPrevQuarterSector = gdpValuesIndustry[1] ? gdpValuesIndustry[1]["Quarter ID"] : undefined;
        const gdpPrevYearQuarterSector = gdpValuesIndustry[4] ? gdpValuesIndustry[4]["Quarter ID"] : undefined;

        // DENUE
        const denueIndustry = {
          cube: "inegi_denue",
          drilldowns: "Month",
          measures: "Companies"
        };

        const denueValues = await axios
          .get(BASE_API, {params: denueIndustry})
          .then(resp => resp.data.data)
          .catch(catcher);
        denueValues.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const denueLastestPeriod = denueValues[0] ? denueValues[0]["Month ID"] : undefined;
        const denuePrevPeriod = denueValues[1] ? denueValues[1]["Month ID"] : undefined;

        // Insurers last month
        const insurersIndustry = {
          cube: "insurers",
          drilldowns: "Egress Month",
          measures: "Patient Count by State"
        };

        const insurerMonth = await axios
          .get(BASE_API, {params: insurersIndustry})
          .then(resp => resp.data.data)
          .catch(catcher);
        insurerMonth.sort((a, b) => b["Egress Month ID"] - a["Egress Month ID"]);
        const insurersLastMonth = insurerMonth[0] ? insurerMonth[0]["Egress Month ID"] : undefined;

        return res.json({
          canonApi: CANON_API,
          customId: isDeepestLevel ? id1.toString().slice(0, 4) : id1,
          customHierarchy: isDeepestLevel ? "Industry Group" : hierarchy1,
          sectorId,
          sectorName,
          customCensusLevel: hierarchy1 === "Sector" ? 1 : hierarchy1 === "Subsector" ? 2 : 3,
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear,
          fdiLatestQuarterIndustry,
          gdpLatestQuarterSector,
          gdpPrevQuarterSector,
          gdpPrevYearQuarterSector,
          denueLastestPeriod,
          denuePrevPeriod,
          isDeepestLevel,
          insurersLastMonth
        });

      default:
        return res.json({
          canonApi: CANON_API
        });
    }
  });

};

