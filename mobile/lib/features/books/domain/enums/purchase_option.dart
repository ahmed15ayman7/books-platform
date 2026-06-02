enum PurchaseOption { direct, referral, notAvailable }

extension PurchaseOptionX on PurchaseOption {
  static PurchaseOption fromString(String? v) => switch (v) {
        'DIRECT' => PurchaseOption.direct,
        'REFERRAL' => PurchaseOption.referral,
        _ => PurchaseOption.notAvailable,
      };
}
