import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, Trash2, AlertTriangle } from "lucide-react";

import {
  useGetSettings,
  useUpdateSettings,
  useResetScores,
  getGetLeaderboardQueryKey,
  getGetGameStatsQueryKey,
  getGetManagerOverviewQueryKey,
} from "@workspace/api-client-react";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MODULES = [
  { id: 1, label: "Ấn Tượng Đầu Tiên" },
  { id: 2, label: "Chào Hỏi Thân Thiện" },
  { id: 3, label: "Thanh Toán Thành Thạo" },
  { id: 4, label: "Tư Vấn Đúng" },
  { id: 5, label: "Tận Tâm Phục Vụ" },
  { id: 6, label: "Xử Lý Khách Khó Tính" },
];

const settingsSchema = z.object({
  storeName: z.string().min(1, "Tên cửa hàng không được để trống"),
  passingScore: z.number().min(0).max(100),
  quickChallengeTimer: z.number().min(5).max(30),
  activeModules: z.array(z.number()),
  customMessagesText: z.string(),
  showLeaderboardOnHome: z.boolean(),
  maxLeaderboardEntries: z.number().min(5).max(50),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const resetScores = useResetScores();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: "",
      passingScore: 70,
      quickChallengeTimer: 15,
      activeModules: [],
      customMessagesText: "",
      showLeaderboardOnHome: true,
      maxLeaderboardEntries: 10,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        storeName: settings.storeName || "",
        passingScore: settings.passingScore || 70,
        quickChallengeTimer: settings.quickChallengeTimer || 15,
        activeModules: settings.activeModules
          ? settings.activeModules.split(",").map(Number).filter(Boolean)
          : [1, 2, 3, 4, 5, 6],
        customMessagesText: settings.customMessages
          ? settings.customMessages.replace(/\|/g, "\n")
          : "",
        showLeaderboardOnHome: settings.showLeaderboardOnHome ?? true,
        maxLeaderboardEntries: settings.maxLeaderboardEntries || 10,
      });
    }
  }, [settings, form]);

  const onSubmit = (data: SettingsFormValues) => {
    const formattedData = {
      storeName: data.storeName,
      passingScore: data.passingScore,
      quickChallengeTimer: data.quickChallengeTimer,
      activeModules: data.activeModules.join(","),
      customMessages: data.customMessagesText.split("\n").map(s => s.trim()).filter(Boolean).join("|"),
      showLeaderboardOnHome: data.showLeaderboardOnHome,
      maxLeaderboardEntries: data.maxLeaderboardEntries,
    };

    updateSettings.mutate(
      { data: formattedData },
      {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Đã lưu cài đặt thành công.",
          });
          setLocation("/manager");
        },
        onError: () => {
          toast({
            title: "Lỗi",
            description: "Không thể lưu cài đặt. Vui lòng thử lại.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleResetScores = () => {
    resetScores.mutate(
      undefined,
      {
        onSuccess: (result) => {
          toast({
            title: "Thành công",
            description: `Đã xóa ${(result as any)?.deleted || 0} điểm số.`,
          });
          queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGameStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetManagerOverviewQueryKey() });
        },
        onError: () => {
          toast({
            title: "Lỗi",
            description: "Không thể xóa điểm số. Vui lòng thử lại.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const passingScoreValue = form.watch("passingScore");
  const getPassingScoreColor = (score: number) => {
    if (score < 60) return "bg-red-500 hover:bg-red-600";
    if (score < 80) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-green-500 hover:bg-green-600";
  };

  const activeModulesCount = form.watch("activeModules")?.length || 0;

  return (
    <div className="min-h-[100dvh] bg-slate-50 pb-32">
      <header className="bg-[#003087] text-white py-6 px-4 md:px-8 mb-8 sticky top-0 z-10 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/manager">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Back to manager" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Cài Đặt Trò Chơi</h1>
            <p className="text-blue-100 text-sm mt-1">Cấu hình cho MM Mega Market</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1 - Store Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cửa Hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên cửa hàng</FormLabel>
                      <FormControl>
                        <Input placeholder="MM Mega Market" data-testid="input-store-name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tên hiển thị trên bảng điều khiển quản lý
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 2 - Scoring */}
            <Card>
              <CardHeader>
                <CardTitle>Điểm Số</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-4">
                        <FormLabel>Điểm vượt qua tối thiểu</FormLabel>
                        <Badge className={getPassingScoreColor(field.value)} data-testid="badge-passing-score">
                          {field.value}
                        </Badge>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          data-testid="slider-passing-score"
                        />
                      </FormControl>
                      <FormDescription>
                        Điểm số để được coi là 'vượt qua' (mặc định: 70)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quickChallengeTimer"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-4">
                        <FormLabel>Thời gian mỗi câu – Thử Thách Nhanh</FormLabel>
                        <span className="font-bold text-slate-700">{field.value}s</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={5}
                          max={30}
                          step={5}
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          data-testid="slider-quick-challenge-timer"
                        />
                      </FormControl>
                      <FormDescription>
                        Giây cho mỗi câu hỏi trong chế độ Thử Thách Nhanh (mặc định: 15s)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 3 - Training Modules */}
            <Card>
              <CardHeader>
                <CardTitle>Module Đào Tạo</CardTitle>
                <CardDescription>Chọn các module hiển thị trong trò chơi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeModulesCount < 3 && (
                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md flex items-start gap-3 text-sm mb-4">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600" />
                    <p>Cần ít nhất 3 module để có trải nghiệm đào tạo đầy đủ.</p>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="activeModules"
                  render={() => (
                    <FormItem>
                      {MODULES.map((module) => (
                        <FormField
                          key={module.id}
                          control={form.control}
                          name="activeModules"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={module.id}
                                className="flex flex-row items-center justify-between rounded-lg border p-4"
                              >
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {module.id}. {module.label}
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value?.includes(module.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, module.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== module.id
                                            )
                                          )
                                    }}
                                    data-testid={`switch-module-${module.id}`}
                                  />
                                </FormControl>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 4 - Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Bảng Xếp Hạng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="showLeaderboardOnHome"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Hiển thị bảng xếp hạng trên trang chủ
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-show-leaderboard"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxLeaderboardEntries"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-4">
                        <FormLabel>Số người trên bảng xếp hạng</FormLabel>
                        <span className="font-bold text-slate-700">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={5}
                          max={50}
                          step={5}
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          data-testid="slider-max-leaderboard"
                        />
                      </FormControl>
                      <FormDescription>
                        Số lượng điểm số hiển thị trên bảng xếp hạng
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 5 - Motivational Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Thông Điệp Khích Lệ</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="customMessagesText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thông điệp tùy chỉnh</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mỗi thông điệp trên một dòng..."
                          className="min-h-[120px]"
                          {...field}
                          data-testid="textarea-messages"
                        />
                      </FormControl>
                      <FormDescription>
                        Mỗi dòng là một thông điệp. Để trống để dùng thông điệp mặc định.
                      </FormDescription>
                      <FormMessage />
                      
                      {!field.value && (
                        <div className="mt-4 p-4 bg-slate-50 border rounded-md text-sm text-slate-500 space-y-2">
                          <p className="font-medium text-slate-700">Thông điệp mặc định:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Khách hàng không chỉ mua sản phẩm. Họ mua trải nghiệm.</li>
                            <li>Thái độ tích cực giúp khách hàng dễ bỏ qua những bất tiện nhỏ.</li>
                            <li>Một nụ cười có thể tạo nên sự khác biệt.</li>
                            <li>Khách hàng không nhớ chúng ta bán gì. Khách hàng nhớ cảm xúc.</li>
                          </ul>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 6 - Danger Zone */}
            <Card className="border-red-200 bg-red-50/30">
              <CardHeader>
                <CardTitle className="text-red-600">Vùng Nguy Hiểm</CardTitle>
                <CardDescription>Các hành động không thể hoàn tác</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto" data-testid="button-reset-scores">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa Tất Cả Điểm Số
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này sẽ xóa vĩnh viễn TẤT CẢ điểm số của nhân viên. Không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-testid="button-cancel-reset">Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetScores}
                        className="bg-red-600 hover:bg-red-700"
                        data-testid="button-confirm-reset"
                      >
                        {resetScores.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Xóa Điểm Số
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:bg-transparent md:border-t-0 md:p-0 md:static md:mt-8 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
              <div className="max-w-2xl mx-auto">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg md:text-base md:h-10" 
                  disabled={updateSettings.isPending}
                  data-testid="button-save-settings"
                >
                  {updateSettings.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  Lưu Thay Đổi
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}