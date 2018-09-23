#include <string>
#include <eosiolib/action.hpp>
#include <eosiolib/singleton.hpp>
#include <eosiolib/time.hpp>
#include <eosiolib/system.h>

using namespace eosio;
using std::string;

typedef uint64_t encrypted_data;

// @abi table provider i64
struct provider
{
  account_name account;

  uint64_t primary_key() const
  {
    return account;
  }

  EOSLIB_SERIALIZE(provider, (account))
};

struct physical_address
{
  encrypted_data longitude;
  encrypted_data latitude;

  EOSLIB_SERIALIZE(physical_address, (longitude)(latitude))
};
// @abi table profile
struct profile
{
  account_name owner;
  checksum256 mroot_sensitive_data;

  encrypted_data birthdate;
  encrypted_data country;
  physical_address residential;

  uint64_t primary_key() const
  {
    return owner;
  }

  EOSLIB_SERIALIZE(profile, (owner)(mroot_sensitive_data)(birthdate)(country)(residential))
};

class kycstore : public eosio::contract
{
private:
  multi_index<N(profile), profile> user_profiles;
  multi_index<N(provider), provider> known_providers;

public:
  using contract::contract;
  kycstore(account_name s) : contract(s), known_providers(_self, _self), user_profiles(_self, _self) {}

  // @abi action
  void addprovider(account_name provider)
  {
    require_auth(permission_level{_self, N(active)});
    eosio_assert(known_providers.find(provider) == known_providers.end(), "Known provider!");

    known_providers.emplace(_self, [&](auto &created_provider) {
      created_provider.account = provider;
    });
  }

  // @abi action
  void addprofile(account_name provider, profile user_profile)
  {
    require_auth(provider);
    eosio_assert(known_providers.find(provider) != known_providers.end(), "Unkown or deleted provider!");

    auto key = user_profile.primary_key();

    // TODO: Update profiles
    eosio_assert(user_profiles.find(key) == user_profiles.end(), "Already provided user");

    user_profiles.emplace(_self, [&](profile &created_profile) {
      created_profile.owner = user_profile.owner;
      created_profile.birthdate = user_profile.birthdate;
      created_profile.country = user_profile.country;
      created_profile.residential = physical_address{
          user_profile.residential.latitude,
          user_profile.residential.longitude};
    });
  }
};

EOSIO_ABI(kycstore, (addprovider)(addprofile))